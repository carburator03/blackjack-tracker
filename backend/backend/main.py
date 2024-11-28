import os
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import BaseModel
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DATETIME
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse
from slowapi.middleware import SlowAPIMiddleware

load_dotenv()

# Database settings
DATABASE_URL = os.getenv("DATABASE_URL")
Base = declarative_base()
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# FastAPI app
app = FastAPI(docs_url=None, redoc_url=None)

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("ALLOW_ORIGIN")],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all HTTP headers
)

# Add SlowAPI middleware
app.add_middleware(SlowAPIMiddleware)

# Database models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True, unique=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    wallet = Column(Integer, default=0)

class Game(Base):
    __tablename__= "games"
    id = Column(Integer, primary_key=True, index=True, unique=True)
    number1 = Column(Integer)
    number2 = Column(Integer)
    number3 = Column(Integer)
    number4 = Column(Integer)
    dealer = Column(Integer)
    prize = Column(Integer)
    user_id = Column(Integer)
    win = Column(Boolean, default=True)
    createdAt = Column(DATETIME)

# Pydantic models
class UserBase(BaseModel):
    username: str

class UserInDB(UserBase):
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class GameResponse(BaseModel):
    id: int
    number1: int
    number2: int
    number3: int
    number4: int
    dealer: int
    prize: int
    win: bool
    createdAt: datetime

class GameCreateRequest(BaseModel):
    number1: int
    number2: int
    number3: int
    number4: int
    dealer: int
    prize: int

class PriceUpdateRequest(BaseModel):
    price: int

class RegisterRequest(BaseModel):
    username: str
    password: str

class TokenRequest(BaseModel):
    username: str
    password: str

# Utility functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user(username: str, db):
    return db.query(User).filter(User.username == username).first()

def authenticate_user(username: str, password: str, db):
    user = get_user(username, db)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    return token_data.username

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Define the rate limit as a variable
RATE_LIMIT = "50/1hour"

banned_ips = set()
# Initialize Limiter with a custom key function and storage
limiter = Limiter(key_func=get_remote_address, default_limits=[RATE_LIMIT])

# Add middleware for rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Custom exception handler for banning IPs
@app.exception_handler(RateLimitExceeded)
async def custom_rate_limit_handler(request: Request, exc: RateLimitExceeded):
    ip = get_remote_address(request)
    banned_ips.add(ip)
    return JSONResponse(
        status_code=429,
        content={"message": "Too many requests, you are banned for 99 days."}
    )

@app.middleware("http")
async def check_banned_ips(request: Request, call_next):
    ip = get_remote_address(request)
    if ip in banned_ips:
        return JSONResponse(
            status_code=403,
            content={"message": "Your IP is banned."}
        )
    response = await call_next(request)
    return response

# Routes with rate limiting
@app.post("/register")
@limiter.limit(RATE_LIMIT)
def register(request: Request, register_request: RegisterRequest, db: Session = Depends(get_db)):
    if get_user(register_request.username, db):
        raise HTTPException(status_code=400, detail="User already exists with this username!")
    if len(register_request.username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters long!")
    if len(register_request.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long!")
    new_user = User(username=register_request.username, password=get_password_hash(register_request.password), wallet=0)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully!"}

@app.post("/token", response_model=Token)
@limiter.limit(RATE_LIMIT)
def login(request: Request, token_request: TokenRequest, db: Session = Depends(get_db)):
    if len(token_request.username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters long!")
    if len(token_request.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long!")
    user = authenticate_user(token_request.username, token_request.password, db)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials!")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/me", response_model=UserBase)
@limiter.limit(RATE_LIMIT)
def read_users_me(request: Request, current_user: UserBase = Depends(get_current_user)):
    return {"username": current_user}

@app.get("/games", response_model=list[GameResponse])
@limiter.limit(RATE_LIMIT)
def get_games(request: Request, db: Session = Depends(get_db), current_user: UserBase = Depends(get_current_user)):
    user = db.query(User).filter(User.username == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    games = db.query(Game).filter(Game.user_id == user.id).order_by(Game.createdAt.desc()).all()
    return games

@app.post("/games")
@limiter.limit(RATE_LIMIT)
def create_game(request: Request, game: list[GameCreateRequest], db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    if len(game) != 1 and len(game) != 4:
        raise HTTPException(status_code=400, detail="Invalid game data")
    username = get_current_user(token)
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    for g in game:
        if g.number1 < 1 or g.number1 > 21 or g.number2 < 1 or g.number2 > 31 or g.number3 < 1 or g.number3 > 21 or g.number4 < 1 or g.number4 > 21 or g.dealer < 1 or g.dealer > 21:
            raise HTTPException(status_code=400, detail="Numbers must be between 1 and 21")
        if g.prize < 300:
            raise HTTPException(status_code=400, detail="Prize must be at least 300")
        new_game = Game(
            number1=g.number1,
            number2=g.number2,
            number3=g.number3,
            number4=g.number4,
            dealer=g.dealer,
            prize=g.prize,
            user_id=user.id,
            win=False,
            createdAt=datetime.utcnow().isoformat()
        )

        if new_game.number1 > new_game.dealer or new_game.number2 > new_game.dealer or new_game.number3 > new_game.dealer or new_game.number4 > new_game.dealer:
            user.wallet += new_game.prize
            new_game.win = True

        db.add(new_game)
    db.commit()
    db.refresh(new_game)

    # Price of the ticket
    if len(game) == 1:
        user.wallet -= 300
    if len(game) == 4:
        user.wallet -= 500
    db.commit()
    db.refresh(user)

    return {"message": "Game added successfully!", "game": new_game}

@app.get("/wallet")
@limiter.limit(RATE_LIMIT)
def get_wallet(request: Request, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    username = get_current_user(token)
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"wallet": user.wallet}

@app.post("/update_wallet")
@limiter.limit(RATE_LIMIT)
def update_wallet(request: Request, price_update: PriceUpdateRequest, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    username = get_current_user(token)
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.wallet += price_update.price
    db.commit()
    db.refresh(user)
    return {"message": "Wallet updated successfully!", "wallet": user.wallet}
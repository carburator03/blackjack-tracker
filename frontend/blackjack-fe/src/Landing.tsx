import Navbar from './components/Navbar';

const Landing = () => {
  return (
    <>
      <Navbar />
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <h1 className='text-4xl font-bold text-center mt-5 text-primary'>
          Welcome to Blackjack-Tracker
        </h1>
        <p className='text-lg text-center mt-3 mb-6 text-secondary'>
          Simple tool to track how much money you wasted
        </p>

        <div className='flex space-x-4'>
          <button
            className='btn btn-secondary mr-2 font-bold'
            onClick={() => (window.location.href = '/login')}
          >
            Login
          </button>
          <button
            className='btn btn-primary font-bold'
            onClick={() => (window.location.href = '/register')}
          >
            Register
          </button>
        </div>
      </div>
    </>
  );
};

export default Landing;

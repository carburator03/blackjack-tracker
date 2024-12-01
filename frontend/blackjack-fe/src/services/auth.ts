// services/auth.ts
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL;

export async function login(username: string, password: string) {
  const response = await axios.post(
    `${API_URL}/token`,
    {
      username,
      password,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }
  return response.data;
}

export function logout() {
  localStorage.removeItem('token');
}

export async function register(username: string, password: string) {
  try {
    const response = await axios.post(
      `${API_URL}/register`,
      {
        username,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error;
  }
}

export function getCurrentUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return jwtDecode<{ sub: string }>(token).sub;
}

export async function getLoggedInUsername() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.username;
}

export async function getGames() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  const response = await axios.get(`${API_URL}/games`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function addGame(gameData: any) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  const response = await axios.post(`${API_URL}/games`, gameData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
}

export async function getWallet() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  const response = await axios.get(`${API_URL}/wallet`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.wallet;
}

export async function deleteGame(gameId: string) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  const response = await axios.delete(`${API_URL}/games`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      id: gameId,
    },
  });
  return response.data;
}

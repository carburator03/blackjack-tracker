import React, { useState } from 'react';
import { login } from '../services/auth';
import Navbar from './Navbar';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      window.location.href = '/dashboard';
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className='flex flex-col items-center justify-center min-h-screen px-8'>
        <h1 className='text-4xl font-bold text-center mt-5 text-primary'>
          Login to Blackjack-Tracker
        </h1>
        <form onSubmit={handleSubmit} className='w-full max-w-sm mt-8'>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>Username:</label>
            <input
              className='input input-bordered w-full bg-gray-100'
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className='mb-6'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>Password:</label>
            <input
              type='password'
              className='input input-bordered w-full bg-gray-100'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          {error && <p className='text-error text-m italic mb-4'>{error}</p>}
          <div className='flex items-center justify-between'>
            <button type='submit' className='btn btn-primary w-1/2 mx-auto'>
              Login
            </button>
          </div>
        </form>
        <div className='mt-6'>
          <p className='text-sm'>
            Don't have an account?{' '}
            <a href='/register' className='text-blue-500 underline'>
              Register here
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;

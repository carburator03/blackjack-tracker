import React, { useState } from 'react';
import { register } from '../services/auth';
import Navbar from './Navbar';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<React.ReactNode>('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Oh no, passwords do not match! 😐');
      return;
    }

    try {
      await register(username, password);
      setSuccessMessage(
        <>
          🎉 That's it! You can now{' '}
          <a href='/login' className='text-blue-500 underline'>
            login here
          </a>
        </>,
      );

      setUsername('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        setErrorMessage(err.response.data.detail);
      } else {
        setErrorMessage('Registration failed 🙁');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className='flex flex-col items-center justify-center min-h-screen px-8'>
        <h1 className='text-4xl font-bold text-center mt-5 text-primary'>
          Register for Blackjack-Tracker
        </h1>
        <form onSubmit={handleSubmit} className='w-full max-w-sm mt-8'>
          {successMessage && <p className='text-success text-l italic mb-4'>{successMessage}</p>}
          {errorMessage && <p className='text-error text-l italic mb-4'>{errorMessage}</p>}
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>Username:</label>
            <input
              type='text'
              className='input input-bordered w-full bg-gray-100'
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>Password:</label>
            <input
              type='password'
              className='input input-bordered w-full bg-gray-100'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className='mb-6'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>Confirm Password:</label>
            <input
              type='password'
              className='input input-bordered w-full bg-gray-100'
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className='flex items-center justify-between'>
            <button type='submit' className='btn btn-primary w-1/2 mx-auto'>
              Register
            </button>
          </div>
        </form>

        <div className='mt-6'>
          <p className='text-sm'>
            Already have an account?{' '}
            <a href='/login' className='text-blue-500 underline'>
              Login here
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;

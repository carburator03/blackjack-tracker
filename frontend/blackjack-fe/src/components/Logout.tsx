import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate('/');
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../atoms/Button';

interface AuthButtonsProps {
  className?: string;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ className = '' }) => {
  const navigate = useNavigate();

  return (
    <div className={`flex gap-4 ${className}`}>
      <Button 
        variant="secondary" 
        onClick={() => navigate('/login')}
        className="px-5 py-2"
      >
        Log In
      </Button>
      <Button 
        variant="primary" 
        onClick={() => navigate('/signup')}
        className="px-5 py-2"
      >
        Sign Up
      </Button>
    </div>
  );
};

export default AuthButtons;
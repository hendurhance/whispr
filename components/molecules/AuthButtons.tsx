'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/atoms/Button';

interface AuthButtonsProps {
  className?: string;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ className = '' }) => {
  const router = useRouter();

  return (
    <div className={`flex gap-4 ${className}`}>
      <Button 
        variant="secondary" 
        onClick={() => router.push('/auth')}
        className="px-5 py-2"
      >
        Log In
      </Button>
      <Button 
        variant="primary" 
        onClick={() => router.push('/auth')}
        className="px-5 py-2"
      >
        Sign Up
      </Button>
    </div>
  );
};

export default AuthButtons;
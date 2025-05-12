import React from 'react';
import Button from '../atoms/Button';

const AuthButtons: React.FC = () => (
  <div className="flex gap-4">
    <Button variant="secondary" onClick={() => window.location.href = '/login'}>
      Log In
    </Button>
    <Button variant="primary" onClick={() => window.location.href = '/signup'}>
      Sign Up
    </Button>
  </div>
);

export default AuthButtons;
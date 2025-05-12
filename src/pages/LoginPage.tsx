import React from 'react';
import AuthTemplate from '../templates/AuthTemplate';

const LoginPage: React.FC = () => (
  <AuthTemplate>
    <h1 className="text-3xl font-bold text-text-bright mb-8">Log In</h1>
    {/* Login form will go here */}
  </AuthTemplate>
);

export default LoginPage;
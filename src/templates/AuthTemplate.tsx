import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../atoms/Logo';

interface AuthTemplateProps {
  children: ReactNode;
}

const AuthTemplate: React.FC<AuthTemplateProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background-darkest flex flex-col">
      {/* Simple header with logo */}
      <header className="py-4 px-6 border-b border-overlay-light">
        <Link to="/">
          <Logo />
        </Link>
      </header>
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-background-card p-8 rounded-2xl shadow-lg border border-overlay-light">
          {children}
        </div>
      </main>
      
      <footer className="py-4 px-6 text-center text-text-muted text-sm">
        <p>© {new Date().getFullYear()} Whispr. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthTemplate;

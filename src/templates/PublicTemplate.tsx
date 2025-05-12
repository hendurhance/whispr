import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../atoms/Logo';

interface PublicTemplateProps {
  children: ReactNode;
}

const PublicTemplate: React.FC<PublicTemplateProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background-darkest flex flex-col">
      {/* Simple header with logo and login/signup */}
      <header className="py-4 px-6 flex justify-between items-center border-b border-overlay-light">
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex gap-4">
          <Link 
            to="/login" 
            className="px-4 py-2 rounded-full bg-background-card text-text-bright hover:bg-background-highlight transition-colors"
          >
            Log In
          </Link>
          <Link 
            to="/signup" 
            className="px-4 py-2 rounded-full bg-gradient-primary text-white hover:shadow-glow transition-all"
          >
            Sign Up
          </Link>
        </div>
      </header>
      
      <main className="flex-grow px-4 py-12">
        <div className="w-full max-w-4xl mx-auto">
          {children}
        </div>
      </main>
      
      <footer className="py-4 px-6 text-center text-text-muted text-sm border-t border-overlay-light">
        <p>© {new Date().getFullYear()} Whispr. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PublicTemplate;
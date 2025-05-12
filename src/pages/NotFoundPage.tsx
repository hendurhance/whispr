import React from 'react';
import { Link } from 'react-router-dom';
import PublicTemplate from '../templates/PublicTemplate';

const NotFoundPage: React.FC = () => (
  <PublicTemplate>
    <div className="text-center py-16">
      <h1 className="text-5xl font-bold text-text-bright mb-6">404</h1>
      <p className="text-text-muted mb-8">Oops! Page not found.</p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-gradient-primary rounded-full text-white hover:shadow-glow transition-all"
      >
        Go Home
      </Link>
    </div>
  </PublicTemplate>
);

export default NotFoundPage;
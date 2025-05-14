import React, { ReactNode } from 'react';
import LandingPageHeader from '../organisms/LandingPage/LandingPageHeader';
import FooterSimple from '../organisms/Shared/FooterSimple';

interface AuthTemplateProps {
  children: ReactNode;
}

const AuthTemplate: React.FC<AuthTemplateProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background-darkest flex flex-col overflow-hidden">
      {/* Use the LandingPageHeader for consistency */}
      <LandingPageHeader />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-background-card p-8 rounded-2xl shadow-lg border border-overlay-light">
          {children}
        </div>
      </main>
      
      <FooterSimple />
    </div>
  );
};

export default AuthTemplate;
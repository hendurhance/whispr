'use client';

import React, { ReactNode } from 'react';
import LandingPageHeader from '@/components/organisms/LandingPage/LandingPageHeader';
import FooterSimple from '@/components/organisms/Shared/FooterSimple';

interface PublicTemplateProps {
  children: ReactNode;
}

const PublicTemplate: React.FC<PublicTemplateProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background-darkest flex flex-col overflow-hidden">
      <LandingPageHeader />
      
      <main className="flex-grow px-4 py-12">
        <div className="w-full max-w-4xl mx-auto">
          {children}
        </div>
      </main>
      
      <FooterSimple />
    </div>
  );
};

export default PublicTemplate;
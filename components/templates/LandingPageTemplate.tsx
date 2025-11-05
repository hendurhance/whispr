'use client';

import React from 'react';
import LandingPageHeader from '@/components/organisms/LandingPage/LandingPageHeader';
import LandingPageMainContent from '@/components/organisms/LandingPage/LandingPageMainContent';
import LandingPageFooter from '@/components/organisms/LandingPage/LandingPageFooter';

const LandingPageTemplate: React.FC = () => (
  <div className="overflow-hidden">
    <LandingPageHeader />
    <LandingPageMainContent />
    <LandingPageFooter />
  </div>
);

export default LandingPageTemplate;
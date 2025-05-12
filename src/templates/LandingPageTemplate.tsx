import React from 'react';
import LandingPageHeader from '../organisms/LandingPage/LandingPageHeader';
import LandingPageMainContent from '../organisms/LandingPage/LandingPageMainContent';
import LandingPageFooter from '../organisms/LandingPage/LandingPageFooter';

const LandingPageTemplate: React.FC = () => (
  <div className="overflow-hidden">
    <LandingPageHeader />
    <LandingPageMainContent />
    <LandingPageFooter />
  </div>
);

export default LandingPageTemplate;
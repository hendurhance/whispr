import React from 'react';
import SocialLinksManager from './SocialLinksManager';

interface SocialLinksTabContentProps {
  className?: string;
}

const SocialLinksTabContent: React.FC<SocialLinksTabContentProps> = ({ className = '' }) => {
  return (
    <div className={className}>
      <p className="text-text-bright mb-4">
        Add your social media links to share with your audience. These links will appear on your public profile.
      </p>
      
      <SocialLinksManager />
      
      <div className="mt-6 pt-4 border-t border-overlay-light">
        <p className="text-text-muted text-sm">
          Upgrade to Whispr Pro to customize the appearance of your social links and add unlimited links to your profile.
        </p>
      </div>
    </div>
  );
};

export default SocialLinksTabContent;
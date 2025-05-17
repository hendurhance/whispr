import React, { ReactNode } from 'react';

interface PhoneMockupProps {
  children: ReactNode;
  className?: string;
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative w-72 h-[600px] ${className}`}>
      {/* Phone Frame */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-glow-sm">
        <div className="absolute inset-0 bg-background-darkest rounded-3xl border border-background-highlight"></div>
        
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-background-darkest rounded-b-xl border-b border-l border-r border-background-highlight"></div>
        
        {/* Phone Screen Content */}
        <div className="absolute inset-0 m-1 rounded-3xl overflow-hidden overflow-y-scroll">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PhoneMockup;
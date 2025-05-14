import React from 'react';

interface MobileHeaderProps {
  displayName: string;
  avatarUrl?: string;
  className?: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  displayName, 
  avatarUrl,
  className = '' 
}) => {
  return (
    <div className={`p-4 flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-primary flex items-center justify-center text-white font-medium">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="text-xl font-bold text-text-bright">{displayName}</div>
      </div>
      
      <button className="p-2 rounded-full bg-background-darkest w-10 h-10 flex items-center justify-center text-text-bright">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      </button>
    </div>
  );
};

export default MobileHeader;
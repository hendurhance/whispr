import React from 'react';
import Badge from '../atoms/Badge';
import { getTimeOfDay } from '../types/whispr';

interface DashboardHeaderProps {
  displayName: string;
  unreadCount: number;
  avatarUrl?: string;
  className?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  displayName, 
  unreadCount,
  avatarUrl,
  className = ''
}) => {
  const timeOfDay = getTimeOfDay();
  
  return (
    <header className={`flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background-card rounded-xl p-5 mb-6 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-primary flex items-center justify-center text-white text-xl font-medium">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-text-bright">
            Good {timeOfDay}, {displayName}!
          </h1>
          {unreadCount > 0 ? (
            <p className="text-text-muted flex items-center gap-2">
              You have <Badge count={unreadCount} variant="accent" /> new whisprs waiting for you
            </p>
          ) : (
            <p className="text-text-muted">
              Welcome to your dashboard
            </p>
          )}
        </div>
      </div>
      
      <div className="flex gap-2 self-end md:self-auto">
        <button className="px-4 py-2 rounded-lg bg-background-highlight text-text-bright hover:bg-overlay-light transition-colors">
          <span className="mr-2">🔗</span>
          Share Your Link
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
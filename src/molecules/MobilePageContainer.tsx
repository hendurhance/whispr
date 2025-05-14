import React, { ReactNode } from 'react';
import MobileNavigationTabs from './MobileNavigationTabs';
import MobileHeader from './MobileHeader';
import { useAuth } from '../context/auth';

interface MobilePageContainerProps {
  children: ReactNode;
  showHeader?: boolean;
  unreadCount?: number;
}

const MobilePageContainer: React.FC<MobilePageContainerProps> = ({ 
  children,
  showHeader = true,
  unreadCount = 0
}) => {
  const { profile, user } = useAuth();
  
  // Default display name and avatar fallbacks if profile is loading
  const displayName = profile?.display_name || user?.user_metadata?.username || 'User';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || '';
  
  return (
    <div className="md:hidden min-h-screen flex flex-col bg-background-lighter p-2">
      {showHeader && (
        <MobileHeader 
          displayName={displayName}
          avatarUrl={avatarUrl}
        />
      )}
      <div className="flex-1 overflow-y-auto pb-20">
        {children}
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <MobileNavigationTabs unreadCount={unreadCount} />
      </div>
    </div>
  );
};

export default MobilePageContainer;
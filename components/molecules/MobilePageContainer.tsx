'use client';

import React, { ReactNode } from 'react';
import MobileNavigationTabs from './MobileNavigationTabs';
import MobileHeader from './MobileHeader';

interface MobilePageContainerProps {
  children: ReactNode;
  showHeader?: boolean;
  unreadCount?: number;
  displayName?: string;
  avatarUrl?: string;
}

const MobilePageContainer: React.FC<MobilePageContainerProps> = ({ 
  children,
  showHeader = true,
  unreadCount = 0,
  displayName = 'User',
  avatarUrl = ''
}) => {
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
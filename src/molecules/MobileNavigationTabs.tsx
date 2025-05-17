import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Badge from '../atoms/Badge';
import useLinks from '../hooks/useLinks';

interface NavigationTabProps {
  icon: string;
  label: string;
  path: string;
  isActive: boolean;
  badgeCount?: number;
}

const NavigationTab: React.FC<NavigationTabProps> = ({ 
  icon, 
  label, 
  path, 
  isActive,
  badgeCount
}) => {
  return (
    <Link
      to={path}
      className={`flex flex-1 flex-col items-center justify-center py-2 ${
        isActive ? 'text-primary' : 'text-text-muted'
      }`}
    >
      <div className="relative">
        <span className="text-xl">{icon}</span>
        {badgeCount !== undefined && badgeCount > 0 && (
          <Badge 
            count={badgeCount} 
            variant="accent"
            className="absolute -top-2 -right-2 text-[10px] h-4 min-w-[16px]" 
          />
        )}
      </div>
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};

interface MobileNavigationTabsProps {
  unreadCount?: number;
}

const MobileNavigationTabs: React.FC<MobileNavigationTabsProps> = ({ 
  unreadCount = 0 
}) => {
  const location = useLocation();
  const { mobileNavItems } = useLinks();
  
  // Prepare navigation items with badge counts where needed
  const navItemsWithBadges = mobileNavItems.map(item => ({
    ...item,
    badgeCount: item.badgeKey === 'unreadCount' ? unreadCount : undefined
  }));
  
  return (
    <div className="bg-background-card border-t border-overlay-light flex">
      {navItemsWithBadges.map((item) => (
        <NavigationTab
          key={item.path}
          icon={item.icon}
          label={item.label}
          path={item.path}
          isActive={location.pathname === item.path}
          badgeCount={item.badgeCount}
        />
      ))}
    </div>
  );
};

export default MobileNavigationTabs;
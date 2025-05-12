import React from 'react';

interface TabItem {
  id: string;
  icon: string;
  label: string;
  isActive?: boolean;
}

interface TabBarProps {
  tabs: TabItem[];
  onTabChange?: (tabId: string) => void;
  className?: string;
}

const TabBar: React.FC<TabBarProps> = ({ tabs, onTabChange, className = '' }) => {
  return (
    <div className={`p-3 border-t border-background-highlight bg-background-card flex justify-around ${className}`}>
      {tabs.map((tab) => (
        <div 
          key={tab.id}
          className="flex flex-col items-center"
          onClick={() => onTabChange && onTabChange(tab.id)}
          role="button"
          tabIndex={0}
        >
          <div 
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1 ${
              tab.isActive ? 'bg-gradient-primary' : 'bg-background-highlight'
            }`}
          >
            {tab.icon}
          </div>
          <span 
            className={`text-xs ${
              tab.isActive ? 'text-accent-purple' : 'text-text-muted'
            }`}
          >
            {tab.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TabBar;
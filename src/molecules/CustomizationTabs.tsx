import React from 'react';

export type TabType = 'settings' | 'appearance' | 'social' | 'stats';

interface CustomizationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const CustomizationTabs: React.FC<CustomizationTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="flex border-b border-overlay-light mb-6 overflow-x-auto pb-1">
      <button
        onClick={() => onTabChange('settings')}
        className={`px-4 py-2 border-b-2 whitespace-nowrap ${activeTab === 'settings' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-bright'}`}
      >
        Settings
      </button>
      <button
        onClick={() => onTabChange('appearance')}
        className={`px-4 py-2 border-b-2 whitespace-nowrap ${activeTab === 'appearance' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-bright'}`}
      >
        Appearance
      </button>
      <button
        onClick={() => onTabChange('social')}
        className={`px-4 py-2 border-b-2 whitespace-nowrap ${activeTab === 'social' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-bright'}`}
      >
        Social Links
      </button>
      <button
        onClick={() => onTabChange('stats')}
        className={`px-4 py-2 border-b-2 whitespace-nowrap ${activeTab === 'stats' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-bright'}`}
      >
        Stats
      </button>
    </div>
  );
};

export default CustomizationTabs;
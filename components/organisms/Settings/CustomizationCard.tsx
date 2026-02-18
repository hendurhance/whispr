'use client';

import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types';
import CustomizationTabs from '@/components/molecules/CustomizationTabs';
import SettingsTabContent from '@/components/molecules/SettingsTabContent';
import StatsTabContent from '@/components/molecules/StatsTabContent';
import AppearanceTabContent from '@/components/molecules/AppearanceTabContent';
import SocialLinksTabContent from '@/components/molecules/SocialLinksTabContent';
import { useProfileSettings } from '@/hooks/useProfileSettings';
import { useProfileStats } from '@/hooks/useProfileStats';
import { TabType } from '@/types';
import { useRouter } from 'next/navigation';

interface CustomizationCardProps {
  initialUser: User;
  initialProfile: Profile | null;
  className?: string;
}

const CustomizationCard: React.FC<CustomizationCardProps> = ({ 
  initialUser, 
  initialProfile, 
  className = '' 
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('settings');
  
  const refreshProfileWrapper = async () => {
    router.refresh();
  };
  const { settings, isLoading, toggleSetting, handleThemeChange, handleBackgroundChange } = 
    useProfileSettings(initialProfile, initialUser, refreshProfileWrapper);
  
  const stats = useProfileStats(initialProfile, initialUser);
  
  const settingsOptions = [
    {
      title: 'Allow Anonymous Messages',
      description: 'Enable or disable anonymous messages',
      enabled: settings.allowAnonymous,
      onToggle: toggleSetting('allowAnonymous', 'allow_anonymous')
    },
    {
      title: 'Show Question Types',
      description: 'Show different types of questions visitors can ask',
      enabled: settings.showQuestionTypes,
      onToggle: toggleSetting('showQuestionTypes', 'show_question_types')
    },
    {
      title: 'Display Social Links',
      description: 'Show your social media links on your profile',
      enabled: settings.displaySocialLinks,
      onToggle: toggleSetting('displaySocialLinks', 'display_social_links')
    }
  ];

  return (
    <div className={`bg-background-card rounded-xl border border-overlay-light p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-text-bright mb-4">Customize Your Link</h2>
      
      <CustomizationTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'settings' && (
        <SettingsTabContent 
          options={settingsOptions} 
          isLoading={isLoading}
        />
      )}
      
      {activeTab === 'appearance' && (
        <AppearanceTabContent
          selectedTheme={settings.selectedTheme}
          selectedBackground={settings.selectedBackground}
          onThemeChange={handleThemeChange}
          onBackgroundChange={handleBackgroundChange}
          isLoading={isLoading}
        />
      )}
      
      {activeTab === 'social' && (
        <SocialLinksTabContent />
      )}
      
      {activeTab === 'stats' && (
        <StatsTabContent stats={stats} />
      )}
    </div>
  );
};

export default CustomizationCard;
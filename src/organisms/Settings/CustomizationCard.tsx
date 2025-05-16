import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth';
import supabase from '../../lib/supabase';
import CustomizationTabs, { TabType } from '../../molecules/CustomizationTabs';
import SettingsTabContent from '../../molecules/SettingsTabContent';
import StatsTabContent from '../../molecules/StatsTabContent';
import AppearanceTabContent from '../../molecules/AppearanceTabContent';
import SocialLinksTabContent from '../../molecules/SocialLinksTabContent';

interface CustomizationCardProps {
  className?: string;
}

const CustomizationCard: React.FC<CustomizationCardProps> = ({ className = '' }) => {
  const { user, profile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('settings');
  const [isLoading, setIsLoading] = useState(false);
  
  // Settings state
  const [allowAnonymous, setAllowAnonymous] = useState(true);
  const [showQuestionTypes, setShowQuestionTypes] = useState(true);
  const [displaySocialLinks, setDisplaySocialLinks] = useState(false);
  
  // Appearance state
  const [selectedTheme, setSelectedTheme] = useState('purple-pink');
  const [selectedBackground, setSelectedBackground] = useState('black');
  
  // Stats state
  const [totalViews, setTotalViews] = useState(0);
  const [totalWhisprs, setTotalWhisprs] = useState(0);
  const [weeklyData, setWeeklyData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  
  // Initialize state from profile
  useEffect(() => {
    if (profile) {
      // Set settings values
      setAllowAnonymous(profile.allow_anonymous ?? true);
      setShowQuestionTypes(profile.show_question_types ?? true);
      setDisplaySocialLinks(profile.display_social_links ?? false);
      
      // Set appearance values
      setSelectedTheme(profile.selected_theme || 'purple-pink');
      setSelectedBackground(profile.selected_background || 'black');
      
      // Set stats values
      setTotalViews(profile.total_views || 0);
      setTotalWhisprs(profile.total_whisprs || 0);
      
      // Fetch weekly stats
      if (user) {
        fetchWeeklyStats(user.id);
      }
    }
  }, [profile, user]);
  
  // Fetch weekly stats from the database
  const fetchWeeklyStats = async (userId: string) => {
    try {
      // Get last 7 days of stats
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6); // 7 days including today
      
      const { data, error } = await supabase
        .from('weekly_stats')
        .select('date, whisprs')
        .eq('user_id', userId)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Error fetching weekly stats:', error);
        return;
      }
      
      // Convert to array of last 7 days
      const statsMap = new Map<string, number>();
      
      // Initialize with zeros for all days in range
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        statsMap.set(dateStr, 0);
      }
      
      // Fill in actual data
      if (data) {
        data.forEach(item => {
          statsMap.set(item.date, item.whisprs);
        });
      }
      
      // Convert map to array of values
      const weeklyValues = Array.from(statsMap.values());
      setWeeklyData(weeklyValues);
      
    } catch (error) {
      console.error('Error in fetchWeeklyStats:', error);
    }
  };
  
  // Update a setting in the database
  const updateSetting = async (field: string, value: boolean | string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          [field]: value,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Refresh profile data
      await refreshProfile();
      
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      // Revert UI state on error (optional)
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle handlers for settings
  const handleToggleAnonymous = () => {
    const newValue = !allowAnonymous;
    setAllowAnonymous(newValue);
    updateSetting('allow_anonymous', newValue);
  };
  
  const handleToggleQuestionTypes = () => {
    const newValue = !showQuestionTypes;
    setShowQuestionTypes(newValue);
    updateSetting('show_question_types', newValue);
  };
  
  const handleToggleSocialLinks = () => {
    const newValue = !displaySocialLinks;
    setDisplaySocialLinks(newValue);
    updateSetting('display_social_links', newValue);
  };
  
  // Theme and background handlers
  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    updateSetting('selected_theme', themeId);
  };
  
  const handleBackgroundChange = (backgroundId: string) => {
    setSelectedBackground(backgroundId);
    updateSetting('selected_background', backgroundId);
  };
  
  // Settings options
  const settingsOptions = [
    {
      title: 'Allow Anonymous Messages',
      description: 'Enable or disable anonymous messages',
      enabled: allowAnonymous,
      onToggle: handleToggleAnonymous
    },
    {
      title: 'Show Question Types',
      description: 'Show different types of questions visitors can ask',
      enabled: showQuestionTypes,
      onToggle: handleToggleQuestionTypes
    },
    {
      title: 'Display Social Links',
      description: 'Show your social media links on your profile',
      enabled: displaySocialLinks,
      onToggle: handleToggleSocialLinks
    }
  ];
  
  // Stats data
  const statsData = {
    totalViews,
    totalWhisprs,
    weeklyData
  };
  
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
          selectedTheme={selectedTheme}
          selectedBackground={selectedBackground}
          onThemeChange={handleThemeChange}
          onBackgroundChange={handleBackgroundChange}
          isLoading={isLoading}
        />
      )}
      
      {activeTab === 'social' && (
        <SocialLinksTabContent />
      )}
      
      {activeTab === 'stats' && (
        <StatsTabContent stats={statsData} />
      )}
    </div>
  );
};

export default CustomizationCard;
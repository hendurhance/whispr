import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { Profile } from '../types';


interface ProfileSettings {
  allowAnonymous: boolean;
  showQuestionTypes: boolean;
  displaySocialLinks: boolean;
  selectedTheme: string;
  selectedBackground: string;
}

export const useProfileSettings = (
  profile: Profile | null, 
  user: User | null, 
  refreshProfile: () => Promise<void>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<ProfileSettings>({
    allowAnonymous: true,
    showQuestionTypes: true,
    displaySocialLinks: false,
    selectedTheme: 'purple-pink',
    selectedBackground: 'black',
  });

  // Initialize state from profile
  useEffect(() => {
    if (profile) {
      setSettings({
        allowAnonymous: profile.allow_anonymous ?? true,
        showQuestionTypes: profile.show_question_types ?? true,
        displaySocialLinks: profile.display_social_links ?? false,
        selectedTheme: profile.selected_theme || 'purple-pink',
        selectedBackground: profile.selected_background || 'black',
      });
    }
  }, [profile]);

  // Update a setting in the database
  const updateSetting = async (field: string, value: boolean | string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Log the update operation for debugging
      console.log(`Updating profile setting: ${field} = ${value} for user ${user.id}`);
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          [field]: value,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select();
      
      // Log the result
      console.log('Update result:', { data, error });
      
      if (error) throw error;
      
      // Refresh profile data
      await refreshProfile();
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      // You could add user feedback here
    } finally {
      setIsLoading(false);
    }
  };

  // Setting toggle handlers
  const toggleSetting = (key: keyof ProfileSettings, dbField: string) => {
    return () => {
      const newValue = !settings[key];
      setSettings(prev => ({ ...prev, [key]: newValue }));
      updateSetting(dbField, newValue);
    };
  };

  // Theme and background handlers
  const handleThemeChange = (themeId: string) => {
    setSettings(prev => ({ ...prev, selectedTheme: themeId }));
    updateSetting('selected_theme', themeId);
  };
  
  const handleBackgroundChange = (backgroundId: string) => {
    setSettings(prev => ({ ...prev, selectedBackground: backgroundId }));
    updateSetting('selected_background', backgroundId);
  };

  return {
    settings,
    isLoading,
    toggleSetting,
    handleThemeChange,
    handleBackgroundChange
  };
};
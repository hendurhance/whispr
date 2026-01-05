import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types';

// Allowed fields that can be updated via this hook (security whitelist)
const ALLOWED_UPDATE_FIELDS = [
  'allow_anonymous',
  'show_question_types',
  'display_social_links',
  'selected_theme',
  'selected_background'
] as const;

type AllowedField = typeof ALLOWED_UPDATE_FIELDS[number];

// Valid theme options
const VALID_THEMES = [
  'purple-pink', 'blue-cyan', 'green-teal', 'orange-yellow',
  'pink-purple', 'red-orange', 'teal-green', 'cyan-blue'
] as const;

// Valid background options
const VALID_BACKGROUNDS = [
  'black', 'dark-navy', 'dark-purple', 'dark-blue',
  'dark-green', 'dark-red', 'gradient-dark', 'gradient-purple'
] as const;

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
  const supabase = createClient();
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

  // Update a setting in the database (with field validation)
  const updateSetting = async (field: AllowedField, value: boolean | string) => {
    if (!user) return;

    // Validate that the field is in the allowed list
    if (!ALLOWED_UPDATE_FIELDS.includes(field)) {
      console.error(`Attempted to update unauthorized field: ${field}`);
      return;
    }

    // Validate theme value if updating theme
    if (field === 'selected_theme' && typeof value === 'string') {
      if (!VALID_THEMES.includes(value as typeof VALID_THEMES[number])) {
        console.error(`Invalid theme value: ${value}`);
        return;
      }
    }

    // Validate background value if updating background
    if (field === 'selected_background' && typeof value === 'string') {
      if (!VALID_BACKGROUNDS.includes(value as typeof VALID_BACKGROUNDS[number])) {
        console.error(`Invalid background value: ${value}`);
        return;
      }
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          [field]: value,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select();

      if (error) throw error;

      // Refresh profile data
      await refreshProfile();
    } catch (error) {
      console.error('Error updating setting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Setting toggle handlers
  const toggleSetting = (key: keyof ProfileSettings, dbField: AllowedField) => {
    return () => {
      const newValue = !settings[key];
      setSettings(prev => ({ ...prev, [key]: newValue }));
      updateSetting(dbField, newValue);
    };
  };

  // Theme and background handlers with validation
  const handleThemeChange = (themeId: string) => {
    // Validate theme before applying
    if (!VALID_THEMES.includes(themeId as typeof VALID_THEMES[number])) {
      console.error(`Invalid theme: ${themeId}`);
      return;
    }
    setSettings(prev => ({ ...prev, selectedTheme: themeId }));
    updateSetting('selected_theme', themeId);
  };

  const handleBackgroundChange = (backgroundId: string) => {
    // Validate background before applying
    if (!VALID_BACKGROUNDS.includes(backgroundId as typeof VALID_BACKGROUNDS[number])) {
      console.error(`Invalid background: ${backgroundId}`);
      return;
    }
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
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

// Boolean-only setting keys for toggleSetting function
type BooleanSettingKey = 'allowAnonymous' | 'showQuestionTypes' | 'displaySocialLinks';
type BooleanDbField = 'allow_anonymous' | 'show_question_types' | 'display_social_links';

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
  // Returns true on success, false on failure
  const updateSetting = async (field: AllowedField, value: boolean | string): Promise<boolean> => {
    if (!user) return false;

    // Runtime validation as defense-in-depth (TypeScript provides compile-time safety)
    if (!ALLOWED_UPDATE_FIELDS.includes(field)) {
      console.error(`Attempted to update unauthorized field: ${field}`);
      return false;
    }

    // Enforce correct types and allowed values based on field
    if (field === 'selected_theme') {
      if (typeof value !== 'string') {
        console.error(`Invalid type for theme value: expected string, got ${typeof value}`);
        return false;
      }
      if (!VALID_THEMES.includes(value as typeof VALID_THEMES[number])) {
        console.error(`Invalid theme value: ${value}`);
        return false;
      }
    } else if (field === 'selected_background') {
      if (typeof value !== 'string') {
        console.error(`Invalid type for background value: expected string, got ${typeof value}`);
        return false;
      }
      if (!VALID_BACKGROUNDS.includes(value as typeof VALID_BACKGROUNDS[number])) {
        console.error(`Invalid background value: ${value}`);
        return false;
      }
    } else {
      // All remaining allowed fields are booleans; enforce boolean type
      if (typeof value !== 'boolean') {
        console.error(`Invalid type for boolean setting ${field}: expected boolean, got ${typeof value}`);
        return false;
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
      return true;
    } catch (error) {
      console.error('Error updating setting:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Setting toggle handlers with error recovery (boolean fields only)
  const toggleSetting = (key: BooleanSettingKey, dbField: BooleanDbField) => {
    return async () => {
      const previousValue = settings[key];
      const newValue = !previousValue;
      // Optimistic update
      setSettings((prev: ProfileSettings) => ({ ...prev, [key]: newValue }));
      // Check return value to determine if update succeeded
      const success = await updateSetting(dbField, newValue);
      if (!success) {
        // Revert on error
        setSettings((prev: ProfileSettings) => ({ ...prev, [key]: previousValue }));
      }
    };
  };

  // Theme and background handlers with validation and error recovery
  const handleThemeChange = async (themeId: string) => {
    // Validate theme before applying
    if (!VALID_THEMES.includes(themeId as typeof VALID_THEMES[number])) {
      console.error(`Invalid theme: ${themeId}`);
      return;
    }
    const previousTheme = settings.selectedTheme;
    // Optimistic update
    setSettings((prev: ProfileSettings) => ({ ...prev, selectedTheme: themeId }));
    // Check return value to determine if update succeeded
    const success = await updateSetting('selected_theme', themeId);
    if (!success) {
      // Revert on error
      setSettings((prev: ProfileSettings) => ({ ...prev, selectedTheme: previousTheme }));
    }
  };

  const handleBackgroundChange = async (backgroundId: string) => {
    // Validate background before applying
    if (!VALID_BACKGROUNDS.includes(backgroundId as typeof VALID_BACKGROUNDS[number])) {
      console.error(`Invalid background: ${backgroundId}`);
      return;
    }
    const previousBackground = settings.selectedBackground;
    // Optimistic update
    setSettings((prev: ProfileSettings) => ({ ...prev, selectedBackground: backgroundId }));
    // Check return value to determine if update succeeded
    const success = await updateSetting('selected_background', backgroundId);
    if (!success) {
      // Revert on error
      setSettings((prev: ProfileSettings) => ({ ...prev, selectedBackground: previousBackground }));
    }
  };

  return {
    settings,
    isLoading,
    toggleSetting,
    handleThemeChange,
    handleBackgroundChange
  };
};
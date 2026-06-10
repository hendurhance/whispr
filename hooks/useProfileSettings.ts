import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types';

const ALLOWED_UPDATE_FIELDS = [
  'allow_anonymous',
  'show_question_types',
  'display_social_links',
  'selected_theme',
  'selected_background',
  'is_indexable'
] as const;

type AllowedField = typeof ALLOWED_UPDATE_FIELDS[number];

const VALID_THEMES = ['flame', 'ultra', 'mint', 'grape', 'pink', 'lime', 'sun', 'sky'] as const;

const VALID_BACKGROUNDS = ['light', 'dark'] as const;

interface ProfileSettings {
  allowAnonymous: boolean;
  showQuestionTypes: boolean;
  displaySocialLinks: boolean;
  isIndexable: boolean;
  selectedTheme: string;
  selectedBackground: string;
}

type BooleanSettingKey = 'allowAnonymous' | 'showQuestionTypes' | 'displaySocialLinks' | 'isIndexable';
type BooleanDbField = 'allow_anonymous' | 'show_question_types' | 'display_social_links' | 'is_indexable';

export const useProfileSettings = (
  profile: Profile | null, 
  user: User | null, 
  refreshProfile: () => Promise<void>
) => {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const initializedRef = useRef(false);
  const [settings, setSettings] = useState<ProfileSettings>({
    allowAnonymous: profile?.allow_anonymous ?? true,
    showQuestionTypes: profile?.show_question_types ?? true,
    displaySocialLinks: profile?.display_social_links ?? false,
    isIndexable: profile?.is_indexable ?? true,
    selectedTheme: profile?.selected_theme || 'flame',
    selectedBackground: profile?.selected_background || 'light',
  });

  useEffect(() => {
    if (initializedRef.current) return;
    if (profile) {
      initializedRef.current = true;
      setSettings({
        allowAnonymous: profile.allow_anonymous ?? true,
        showQuestionTypes: profile.show_question_types ?? true,
        displaySocialLinks: profile.display_social_links ?? false,
        isIndexable: profile.is_indexable ?? true,
        selectedTheme: profile.selected_theme || 'flame',
        selectedBackground: profile.selected_background || 'light',
      });
    }
  }, [profile]);

  const updateSetting = async (field: AllowedField, value: boolean | string): Promise<boolean> => {
    if (!user) return false;

    if (!ALLOWED_UPDATE_FIELDS.includes(field)) {
      console.error(`Attempted to update unauthorized field: ${field}`);
      return false;
    }

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

      await refreshProfile();
      return true;
    } catch (error) {
      console.error('Error updating setting:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSetting = (key: BooleanSettingKey, dbField: BooleanDbField) => {
    return async () => {
      const previousValue = settings[key];
      const newValue = !previousValue;
      setSettings((prev: ProfileSettings) => ({ ...prev, [key]: newValue }));
      const success = await updateSetting(dbField, newValue);
      if (!success) {
        setSettings((prev: ProfileSettings) => ({ ...prev, [key]: previousValue }));
      }
    };
  };

  const handleThemeChange = async (themeId: string) => {
    if (!VALID_THEMES.includes(themeId as typeof VALID_THEMES[number])) {
      console.error(`Invalid theme: ${themeId}`);
      return;
    }
    const previousTheme = settings.selectedTheme;
    setSettings((prev: ProfileSettings) => ({ ...prev, selectedTheme: themeId }));
    const success = await updateSetting('selected_theme', themeId);
    if (!success) {
      setSettings((prev: ProfileSettings) => ({ ...prev, selectedTheme: previousTheme }));
    }
  };

  const handleBackgroundChange = async (backgroundId: string) => {
    if (!VALID_BACKGROUNDS.includes(backgroundId as typeof VALID_BACKGROUNDS[number])) {
      console.error(`Invalid background: ${backgroundId}`);
      return;
    }
    const previousBackground = settings.selectedBackground;
    setSettings((prev: ProfileSettings) => ({ ...prev, selectedBackground: backgroundId }));
    const success = await updateSetting('selected_background', backgroundId);
    if (!success) {
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

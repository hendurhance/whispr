import { useState, useEffect, useCallback } from 'react';
import { useStaticAuth } from '@/context/StaticAuthContext';
import { createClient } from '@/utils/supabase/client';
import { SocialLink } from '@/types';
import { isValidUrl } from '@/utils/validation';

export interface SocialLinkOperation {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

export const platformOptions = [
  { id: 'instagram', name: 'Instagram' },
  { id: 'tiktok', name: 'TikTok' },
  { id: 'twitter', name: 'X (Twitter)' },
  { id: 'snapchat', name: 'Snapchat' },
  { id: 'youtube', name: 'YouTube' },
  { id: 'threads', name: 'Threads' },
  { id: 'facebook', name: 'Facebook' },
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'discord', name: 'Discord' },
  { id: 'twitch', name: 'Twitch' },
  { id: 'spotify', name: 'Spotify' },
  { id: 'reddit', name: 'Reddit' },
  { id: 'pinterest', name: 'Pinterest' },
  { id: 'whatsapp', name: 'WhatsApp' },
  { id: 'telegram', name: 'Telegram' },
  { id: 'github', name: 'GitHub' },
  { id: 'website', name: 'Website' }
] as const;

const MAX_SOCIAL_LINKS = 10;

const VALID_PLATFORM_IDS = [
  'instagram', 'tiktok', 'twitter', 'snapchat', 'youtube', 'threads', 'facebook',
  'linkedin', 'discord', 'twitch', 'spotify', 'reddit', 'pinterest', 'whatsapp',
  'telegram', 'github', 'website',
] as const;

export const useSocialLinks = () => {
  const supabase = createClient();
  const { user } = useStaticAuth();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [operation, setOperation] = useState<SocialLinkOperation>({
    isLoading: false,
    error: null,
    success: null
  });

  const setStatusMessage = (status: Partial<SocialLinkOperation>) => {
    setOperation(prev => ({ ...prev, ...status }));

    if (status.success || status.error) {
      setTimeout(() => {
        setOperation(prev => ({ 
          ...prev, 
          success: status.success ? null : prev.success,
          error: status.error ? null : prev.error 
        }));
      }, 3000);
    }
  };

  const fetchSocialLinks = useCallback(async () => {
    if (!user) return;
    
    setOperation(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('user_id', user.id)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      setSocialLinks(data || []);
    } catch (error) {
      console.error('Error fetching social links:', error);
      setStatusMessage({ error: 'Failed to load social links' });
    } finally {
      setOperation(prev => ({ ...prev, isLoading: false }));
    }
  }, [user]);
  
  useEffect(() => {
    if (user) {
      fetchSocialLinks();
    }
  }, [user, fetchSocialLinks]);
  
  const addSocialLink = async (platform: string, url: string): Promise<boolean> => {
    if (!user) return false;

    if (operation.isLoading) {
      return false;
    }

    if (!platform || !url) {
      setStatusMessage({ error: 'Please provide both platform and URL' });
      return false;
    }

    const trimmedUrl = url.trim();
    const trimmedPlatform = platform.trim().toLowerCase();

    if (!VALID_PLATFORM_IDS.includes(trimmedPlatform as typeof VALID_PLATFORM_IDS[number])) {
      setStatusMessage({ error: 'Invalid platform selected' });
      return false;
    }

    if (!isValidUrl(trimmedUrl)) {
      setStatusMessage({ error: 'Please enter a valid URL (must start with http:// or https://)' });
      return false;
    }

    if (socialLinks.length >= MAX_SOCIAL_LINKS) {
      setStatusMessage({ error: `You can only add up to ${MAX_SOCIAL_LINKS} social links` });
      return false;
    }

    const existingPlatform = socialLinks.find(link => link.platform.toLowerCase() === trimmedPlatform);
    if (existingPlatform) {
      setStatusMessage({ error: `You already have a ${getPlatformName(trimmedPlatform)} link. Delete the existing one first.` });
      return false;
    }

    setOperation(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const nextOrder = socialLinks.length > 0
        ? Math.max(...socialLinks.map(link => link.display_order || 0)) + 1
        : 0;

      const { error } = await supabase
        .from('social_links')
        .insert([{
          user_id: user.id,
          platform: trimmedPlatform,
          url: trimmedUrl,
          display_order: nextOrder
        }]);

      if (error) throw error;

      await fetchSocialLinks();

      setStatusMessage({ success: 'Social link added successfully' });
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while adding the social link';
      console.error(errorMessage, error);
      setStatusMessage({ error: `Failed to add social link: ${errorMessage}` });
      return false;
    } finally {
      setOperation(prev => ({ ...prev, isLoading: false }));
    }
  };
  
  const deleteSocialLink = async (id: string): Promise<boolean> => {
    if (!user) return false;
    
    setOperation(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setSocialLinks(prevLinks => prevLinks.filter(link => link.id !== id));
      
      setStatusMessage({ success: 'Social link removed' });
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while deleting the social link';
      console.error(errorMessage, error);
      setStatusMessage({ error: `Failed to delete social link: ${errorMessage}` });
      return false;
    } finally {
      setOperation(prev => ({ ...prev, isLoading: false }));
    }
  };
  
  const getPlatformName = (platformId: string): string => {
    const platform = platformOptions.find(p => p.id === platformId);
    return platform ? platform.name : platformId;
  };

  return {
    socialLinks,
    isLoading: operation.isLoading,
    error: operation.error,
    success: operation.success,
    addSocialLink,
    deleteSocialLink,
    getPlatformName,
    platformOptions
  };
};

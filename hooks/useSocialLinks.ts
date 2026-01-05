import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/auth';
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
  { id: 'twitter', name: 'Twitter' },
  { id: 'tiktok', name: 'TikTok' },
  { id: 'youtube', name: 'YouTube' },
  { id: 'facebook', name: 'Facebook' },
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'github', name: 'GitHub' },
  { id: 'website', name: 'Website' }
] as const;

// Maximum number of social links allowed per user
const MAX_SOCIAL_LINKS = 10;

// Valid platform IDs - use as const for type safety
const VALID_PLATFORM_IDS = ['instagram', 'twitter', 'tiktok', 'youtube', 'facebook', 'linkedin', 'github', 'website'] as const;

export const useSocialLinks = () => {
  const supabase = createClient();
  const { user } = useAuth();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [operation, setOperation] = useState<SocialLinkOperation>({
    isLoading: false,
    error: null,
    success: null
  });

  // Clear status messages after a delay
  const setStatusMessage = (status: Partial<SocialLinkOperation>) => {
    setOperation(prev => ({ ...prev, ...status }));
    
    // Clear success/error messages after 3 seconds
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

  // Fetch social links from the database
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
  
  // Load social links on mount or when user changes
  useEffect(() => {
    if (user) {
      fetchSocialLinks();
    }
  }, [user, fetchSocialLinks]);
  
  // Add a new social link
  const addSocialLink = async (platform: string, url: string): Promise<boolean> => {
    if (!user) return false;

    // Prevent concurrent operations (race condition protection)
    if (operation.isLoading) {
      return false;
    }

    // Validate inputs are provided
    if (!platform || !url) {
      setStatusMessage({ error: 'Please provide both platform and URL' });
      return false;
    }

    const trimmedUrl = url.trim();
    const trimmedPlatform = platform.trim().toLowerCase();

    // Validate platform is in allowed list
    if (!VALID_PLATFORM_IDS.includes(trimmedPlatform as typeof VALID_PLATFORM_IDS[number])) {
      setStatusMessage({ error: 'Invalid platform selected' });
      return false;
    }

    // Proper URL validation using URL constructor
    if (!isValidUrl(trimmedUrl)) {
      setStatusMessage({ error: 'Please enter a valid URL (must start with http:// or https://)' });
      return false;
    }

    // Check if user has reached the maximum limit
    if (socialLinks.length >= MAX_SOCIAL_LINKS) {
      setStatusMessage({ error: `You can only add up to ${MAX_SOCIAL_LINKS} social links` });
      return false;
    }

    // Check for duplicate platform (case-insensitive comparison)
    const existingPlatform = socialLinks.find(link => link.platform.toLowerCase() === trimmedPlatform);
    if (existingPlatform) {
      setStatusMessage({ error: `You already have a ${getPlatformName(trimmedPlatform)} link. Delete the existing one first.` });
      return false;
    }

    setOperation(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Get next display order
      const nextOrder = socialLinks.length > 0
        ? Math.max(...socialLinks.map(link => link.display_order || 0)) + 1
        : 0;

      // Insert new link
      // NOTE: Server-side validation (unique constraint, row count limits) should be
      // implemented in the database to handle TOCTOU race conditions. The client-side
      // checks above are for UX optimization only.
      const { error } = await supabase
        .from('social_links')
        .insert([{
          user_id: user.id,
          platform: trimmedPlatform,
          url: trimmedUrl,
          display_order: nextOrder
        }]);

      if (error) throw error;

      // Refetch links to ensure we have the latest data
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
  
  // Delete a social link
  const deleteSocialLink = async (id: string): Promise<boolean> => {
    if (!user) return false;
    
    setOperation(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Extra safety check
      
      if (error) throw error;
      
      // Update local state for immediate UI response
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
  
  // Get platform display name
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
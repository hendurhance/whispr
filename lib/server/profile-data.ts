import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { Profile } from '@/types';

/**
 * Fetch user profile data server-side
 * Returns null if no profile exists or user is not authenticated
 * Cached per request to avoid duplicate fetches
 */
export const getProfileData = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();
  
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    const getCachedProfile = unstable_cache(
      async (userId: string) => {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (profileError) {
          if (profileError.code === 'PGRST116') {
            return null;
          }
          throw profileError;
        }
        
        return profile as Profile;
      },
      ['profile-data'],
      {
        revalidate: 60, // Cache for 60 seconds
        tags: ['profile']
      }
    );
    
    return await getCachedProfile(user.id);
  } catch (error) {
    return null;
  }
});

/**
 * Fetch user whisprs server-side
 * Cached per request to avoid duplicate fetches
 */
export const getWhisprsData = cache(async () => {
  const supabase = await createClient();
  
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { whisprs: [], user: null };
    }

    const getCachedWhisprs = unstable_cache(
      async (userId: string) => {
        const { data: whisprs, error: whisprsError } = await supabase
          .from('whisprs')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (whisprsError) {
          return [];
        }
        
        return whisprs || [];
      },
      ['whisprs-data'],
      {
        revalidate: 30, // Cache for 30 seconds
        tags: ['whisprs']
      }
    );
    
    const whisprs = await getCachedWhisprs(user.id);
    
    return { 
      whisprs, 
      user 
    };
  } catch (error) {
    return { whisprs: [], user: null };
  }
});

/**
 * Get user session server-side
 * Cached per request to avoid duplicate fetches
 */
export const getUserSession = cache(async () => {
  const supabase = await createClient();
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    return user;
  } catch (error) {
    return null;
  }
});

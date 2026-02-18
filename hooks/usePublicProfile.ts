import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { createClient } from '@/utils/supabase/client';
import { FUNCTIONS } from '@/configs';
import { submitWhispr, updateWhisprCount } from '@/lib/client/whisprs';

interface PublicProfileData {
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  totalWhisprs: number;
  displaySocialLinks: boolean;
  socialLinks: Array<{
    id: string;
    platform: string;
    url: string;
    displayOrder: number;
  }>;
  allowAnonymous: boolean;
  showQuestionTypes: boolean;
  selectedTheme: string;
  selectedBackground: string;
}

interface UsePublicProfileProps {
  username: string | undefined;
}

/**
 * Hook for fetching and managing public profile data
 */
export const usePublicProfile = ({ username }: UsePublicProfileProps) => {
  const supabase = createClient();
  const [profile, setProfile] = useState<PublicProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const viewUpdatedRef = useRef(false);

  const updateProfileViews = async (profileUsername: string) => {
    try {
      const response = await fetch(FUNCTIONS.UPDATE_PROFILE_VIEWS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: profileUsername })
      });

      if (!response.ok) {
        return;
      }

      viewUpdatedRef.current = true;
    } catch {
      // Error updating profile views - silent fail
    }
  };

  useEffect(() => {
    let ignore = false;

    const fetchProfile = async () => {
      if (!username) {
        setError('Username not provided');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            username,
            display_name,
            avatar_url,
            bio,
            user_id,
            total_whisprs,
            display_social_links,
            allow_anonymous,
            show_question_types,
            selected_theme,
            selected_background
          `)
          .eq('username', username)
          .single();

        if (ignore) return;

        if (error) {
          console.error('Error fetching profile:', error);
          setError('Profile not found');
          setIsLoading(false);
          return;
        }

        let socialLinks: Array<{ id: string; platform: string; url: string; displayOrder: number }> = [];
        if (data && data.display_social_links) {
          const { data: links, error: linksError } = await supabase
            .from('social_links')
            .select('*')
            .eq('user_id', data.user_id)
            .order('display_order', { ascending: true });

          if (ignore) return;

          if (!linksError && links) {
            socialLinks = links;
          }
        }

        setProfile({
          username: data.username,
          displayName: data.display_name,
          avatarUrl: data.avatar_url,
          bio: data.bio,
          totalWhisprs: data.total_whisprs || 0,
          displaySocialLinks: data.display_social_links,
          socialLinks,
          allowAnonymous: data.allow_anonymous,
          showQuestionTypes: data.show_question_types,
          selectedTheme: data.selected_theme,
          selectedBackground: data.selected_background
        });

        setIsLoading(false);

        if (!viewUpdatedRef.current) {
          updateProfileViews(data.username);
        }
      } catch (error) {
        if (ignore) return;
        console.error('Error in fetchProfile:', error);
        setError('Error loading profile');
        setIsLoading(false);
      }
    };

    fetchProfile();

    return () => {
      ignore = true;
    };
  }, [username]);

  const handleSubmitSuccess = async () => {
    setSubmitSuccess(true);
    toast.success('Your whispr has been sent!');

    if (profile) {
      const newWhisprCount = await updateWhisprCount(profile.username);

      if (newWhisprCount !== null) {
        setProfile({
          ...profile,
          totalWhisprs: newWhisprCount
        });
      } else {
        setProfile({
          ...profile,
          totalWhisprs: profile.totalWhisprs + 1
        });
      }
    }

    setTimeout(() => {
      setSubmitSuccess(false);
    }, 3000);
  };

  const handleSubmitError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'Failed to send whispr';
    toast.error(errorMessage);
    console.error('Whispr submission error:', error);
  };

  return {
    profile,
    isLoading,
    error,
    submitSuccess,
    setSubmitSuccess,
    submitWhispr,
    handleSubmitSuccess,
    handleSubmitError
  };
};

export default usePublicProfile;

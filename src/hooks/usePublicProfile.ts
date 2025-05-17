import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import supabase from '../lib/supabase';
import CONFIGURATIONS, { FUNCTIONS } from '../configs';

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
  const [profile, setProfile] = useState<PublicProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [viewUpdated, setViewUpdated] = useState(false);
  
  // Update profile views when page loads
  const updateProfileViews = async (username: string) => {
    try {
      const response = await fetch(FUNCTIONS.UPDATE_PROFILE_VIEWS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Failed to update profile views:', data.error);
        return;
      }
      
      console.log('Profile views updated:', data);
      setViewUpdated(true);
    } catch (error) {
      console.error('Error updating profile views:', error);
    }
  };
  
  // Update whispr count after submission
  const updateWhisprCount = async (username: string) => {
    try {
      const response = await fetch(CONFIGURATIONS.FUNCTIONS.UPDATE_WHISPR_COUNTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Failed to update whispr count:', data.error);
        return null;
      }
      
      console.log('Whispr count updated:', data);
      return data.whisprs; // Return the new whispr count
    } catch (error) {
      console.error('Error updating whispr count:', error);
      return null;
    }
  };
  
  // Submit a whispr via edge function
  const submitWhispr = async (username: string, content: string, type: string) => {
    try {
      const response = await fetch(CONFIGURATIONS.FUNCTIONS.SUBMIT_WHISPR, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, content, type })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Failed to submit whispr:', data.error);
        throw new Error(data.error || 'Failed to submit whispr');
      }
      
      console.log('Whispr submitted successfully:', data);
      return data;
    } catch (error) {
      console.error('Error submitting whispr:', error);
      throw error;
    }
  };
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) {
        setError('Username not provided');
        setIsLoading(false);
        return;
      }
      
      try {
        // Fetch the profile
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
        
        if (error) {
          console.error('Error fetching profile:', error);
          setError('Profile not found');
          setIsLoading(false);
          return;
        }
        
        // If profile exists, fetch social links if enabled
        let socialLinks = [];
        if (data && data.display_social_links) {
          const { data: links, error: linksError } = await supabase
            .from('social_links')
            .select('*')
            .eq('user_id', data.user_id)
            .order('display_order', { ascending: true });
          
          if (!linksError && links) {
            socialLinks = links;
          }
        }
        
        // Set the profile data
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
        
        // Update profile views once profile is fetched
        if (!viewUpdated) {
          updateProfileViews(data.username);
        }
      } catch (error) {
        console.error('Error in fetchProfile:', error);
        setError('Error loading profile');
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [username, viewUpdated]);
  
  // Handle successful whispr submission
  const handleSubmitSuccess = async () => {
    setSubmitSuccess(true);
    toast.success('Your whispr has been sent!');
    
    // Update whispr count via edge function
    if (profile) {
      const newWhisprCount = await updateWhisprCount(profile.username);
      
      if (newWhisprCount !== null) {
        // Update the profile state with the new count
        setProfile({
          ...profile,
          totalWhisprs: newWhisprCount
        });
      } else {
        // If edge function failed, just increment locally
        setProfile({
          ...profile,
          totalWhisprs: profile.totalWhisprs + 1
        });
      }
    }
    
    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 3000);
  };
  
  // Handle error in whispr submission
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
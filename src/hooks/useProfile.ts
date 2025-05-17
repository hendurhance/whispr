import { useAuth } from '../context/auth';
import { getUsernameLink } from './getUsernameLink';

/**
 * Hook for accessing and managing user profile information
 */
export const useProfile = () => {
  const { user, profile } = useAuth();
  
  // Extract and normalize profile data
  const profileData = {
    // Use fallbacks for all profile properties
    displayName: profile?.display_name || user?.user_metadata?.username || 'User',
    username: profile?.username || user?.user_metadata?.username || 'username',
    avatarUrl: profile?.avatar_url || user?.user_metadata?.avatar_url || '',
    bio: profile?.bio || '',
    
    // Theme and customization settings
    theme: profile?.selected_theme || 'purple-pink',
    background: profile?.selected_background || 'dark-navy',
    
    // Privacy and feature settings
    allowAnonymous: profile?.allow_anonymous ?? true,
    showQuestionTypes: profile?.show_question_types ?? true,
    
    // Social links settings
    displaySocialLinks: profile?.display_social_links ?? false,
    
    // Stats
    totalWhisprs: profile?.total_whisprs || 0
  };
  
  // Generate profile link
  const profileLink = getUsernameLink(profileData.username);
  
  // Determine profile completeness (for onboarding, etc.)
  const profileComplete = 
    !!profileData.username && 
    !!profileData.displayName && 
    profileData.displayName !== 'User';
  
  // Helper to check if profile is loaded
  const isProfileLoaded = !!profile && !!user;
  
  return {
    ...profileData,
    profileLink,
    profileComplete,
    isProfileLoaded,
    
    // Original data
    rawProfile: profile,
    rawUser: user
  };
};

export default useProfile;
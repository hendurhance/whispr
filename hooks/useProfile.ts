import { useStaticAuth } from '@/context/StaticAuthContext';
import { getUsernameLink } from './getUsernameLink';

/**
 * Hook for accessing and managing user profile information
 */
export const useProfile = () => {
  const { user, profile } = useStaticAuth();
  
  const profileData = {
    displayName: profile?.display_name || user?.user_metadata?.username || 'User',
    username: profile?.username || user?.user_metadata?.username || 'username',
    avatarUrl: profile?.avatar_url || user?.user_metadata?.avatar_url || '',
    bio: profile?.bio || '',
    
    theme: profile?.selected_theme || 'purple-pink',
    background: profile?.selected_background || 'dark-navy',

    allowAnonymous: profile?.allow_anonymous ?? true,
    showQuestionTypes: profile?.show_question_types ?? true,

    displaySocialLinks: profile?.display_social_links ?? false,

    totalWhisprs: profile?.total_whisprs || 0
  };
  
  const profileLink = getUsernameLink(profileData.username);

  const profileComplete =
    !!profileData.username && 
    !!profileData.displayName && 
    profileData.displayName !== 'User';
  
  const isProfileLoaded = !!profile && !!user;
  
  return {
    ...profileData,
    profileLink,
    profileComplete,
    isProfileLoaded,
    
    rawProfile: profile,
    rawUser: user
  };
};

export default useProfile;
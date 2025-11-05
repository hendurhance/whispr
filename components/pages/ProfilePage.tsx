'use client';

import React from 'react';
import DashboardTemplate from '@/components/templates/DashboardTemplate';
import MobilePageContainer from '@/components/molecules/MobilePageContainer';
import ProfileCard from '@/components/molecules/ProfileCard';
import ProfileLinkCard from '@/components/molecules/ProfileLinkCard';
import ProfileHeader from '@/components/organisms/Profile/ProfileHeader';
import CustomizationCard from '@/components/organisms/Settings/CustomizationCard';
import { useRouter } from 'next/navigation';
import { getUsernameLink } from '@/hooks/getUsernameLink';
import { useResponsive } from '@/hooks/useResponsive';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types';

interface ProfilePageProps {
  initialUser: User;
  initialProfile: Profile | null;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ initialUser, initialProfile }) => {
  const { isMobile } = useResponsive();
  
  // Use server-fetched data
  const displayName = initialProfile?.display_name || initialUser?.user_metadata?.username || 'User';
  const username = initialProfile?.username || initialUser?.user_metadata?.username || 'username';
  const avatarUrl = initialProfile?.avatar_url || initialUser?.user_metadata?.avatar_url || '';
  const bio = initialProfile?.bio || '';
  
  // Profile link
  const profileLink = getUsernameLink(username);
  
  const router = useRouter();

  // Handle navigation to settings
  const handleEditProfile = () => {
    router.push('/settings');
  };
  
  // Mobile view
  if (isMobile) {
    return (
      <MobilePageContainer 
        showHeader={true}
        displayName={displayName}
        avatarUrl={avatarUrl}
      >
        <ProfileHeader
          title="Your Profile Link" 
          subtitle="Share your unique link to receive anonymous whisprs" 
          className="mt-2"
        />
        
        <div className="px-4 pb-4 space-y-4">
          <ProfileLinkCard 
            username={username} 
            profileLink={profileLink} 
          />
          
          <ProfileCard 
            username={username}
            displayName={displayName}
            avatarUrl={avatarUrl}
            bio={bio}
            onEditProfile={handleEditProfile}
          />
          
          <CustomizationCard 
            initialUser={initialUser}
            initialProfile={initialProfile}
          />
        </div>
      </MobilePageContainer>
    );
  }
  
  // Desktop view
  return (
    <DashboardTemplate>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-bright mb-2">Your Profile Link</h1>
        <p className="text-text-muted">
          Share your unique link to receive anonymous whisprs
        </p>
      </div>
      
      <div className="flex flex-col xl:flex-row gap-8">
        {/* QR Code and Link */}
        <ProfileLinkCard 
          username={username} 
          profileLink={profileLink} 
          className="flex-1"
        />
        
        {/* Profile Preview and Tools */}
        <div className="flex flex-col flex-1">
          <ProfileCard 
            username={username}
            displayName={displayName}
            avatarUrl={avatarUrl}
            bio={bio}
            onEditProfile={handleEditProfile}
            className="mb-6"
          />
          
          <CustomizationCard 
            className="flex-1"
            initialUser={initialUser}
            initialProfile={initialProfile}
          />
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default ProfilePage;
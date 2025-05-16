import React, { useState, useEffect } from 'react';
import DashboardTemplate from '../templates/DashboardTemplate';
import { useAuth } from '../context/auth';
import MobilePageContainer from '../molecules/MobilePageContainer';
import ProfileCard from '../molecules/ProfileCard';
import ProfileLinkCard from '../molecules/ProfileLinkCard';
import ProfileHeader from '../organisms/Profile/ProfileHeader';
import CustomizationCard from '../organisms/Settings/CustomizationCard';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, profile } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  
  // Default display name and avatar fallbacks if profile is loading
  const displayName = profile?.display_name || user?.user_metadata?.username || 'User';
  const username = profile?.username || user?.user_metadata?.username || 'username';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || '';
  const bio = profile?.bio || '';
  
  // Profile link
  const profileLink = `https://trywhispr.me/${username}`;
  
  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const navigate = useNavigate();

  // Handle navigation to settings
  const handleEditProfile = () => {
    navigate('/settings');
  };
  
  // Mobile view
  if (isMobile) {
    return (
      <MobilePageContainer showHeader={true}>
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
          
          <CustomizationCard />
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
          
          <CustomizationCard className="flex-1" />
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default ProfilePage;
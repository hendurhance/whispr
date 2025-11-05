'use client';

import React from 'react';
import DashboardTemplate from '@/components/templates/DashboardTemplate';
import MobilePageContainer from '@/components/molecules/MobilePageContainer';
import ProfileHeader from '@/components/organisms/Profile/ProfileHeader';
import ProfileForm from '@/components/organisms/Profile/ProfileForm';
import EmailSettings from '@/components/organisms/Settings/EmailSettings';
import AccountManagement from '@/components/organisms/Settings/AccountManagement';
import { useResponsive } from '@/hooks/useResponsive';
import { useSetting } from '@/hooks/useSetting';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types';

interface SettingsPageProps {
  initialUser: User;
  initialProfile: Profile | null;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ initialUser, initialProfile }) => {
  const { isMobile } = useResponsive();
  const {
    // Form values
    username,
    displayName,
    bio,
    avatarUrl,
    emailNotifications,
    
    // UI state
    isCheckingUsername,
    isUsernameAvailable,
    isSubmitting,
    isDeleting,
    error,
    successMessage,
    
    // Handlers
    handleUsernameChange,
    setDisplayName,
    setBio,
    setAvatarUrl,
    handleToggleNotifications,
    handleSubmit,
    handleDeleteAccount
  } = useSetting({ initialUser, initialProfile });

  // Profile information for MobilePageContainer
  const profileDisplayName = initialProfile?.display_name || initialUser?.user_metadata?.username || 'User';
  const profileAvatarUrl = initialProfile?.avatar_url || initialUser?.user_metadata?.avatar_url || '';

  // Empty handler for sign out everywhere - will be handled by AccountManagement component
  const handleSignOutEverywhere = () => {};

  // Mobile view
  if (isMobile) {
    return (
      <MobilePageContainer 
        showHeader={true}
        displayName={profileDisplayName}
        avatarUrl={profileAvatarUrl}
      >
        <ProfileHeader title="Account Settings" className="mt-2" />

        <div className="px-4 pb-4 space-y-4">
          <ProfileForm
            username={username}
            displayName={displayName}
            bio={bio}
            avatarUrl={avatarUrl}
            isAvailable={isUsernameAvailable}
            isCheckingUsername={isCheckingUsername}
            onUsernameChange={handleUsernameChange}
            onDisplayNameChange={setDisplayName}
            onBioChange={setBio}
            onAvatarChange={setAvatarUrl}
            onSubmit={handleSubmit}
            error={error}
            successMessage={successMessage}
            isSubmitting={isSubmitting}
          />

          <EmailSettings
            email={initialUser?.email || ''}
            enableNotifications={emailNotifications}
            onToggleNotifications={handleToggleNotifications}
            userId={initialUser?.id}
          />

          <AccountManagement
            onSignOutEverywhere={handleSignOutEverywhere}
            onDeleteAccount={handleDeleteAccount}
            isDeleting={isDeleting}
          />
        </div>
      </MobilePageContainer>
    );
  }

  // Desktop view
  return (
    <DashboardTemplate>
      <h1 className="text-3xl font-bold text-text-bright mb-6">Account Settings</h1>

      <div className="space-y-8">
        <ProfileForm
          username={username}
          displayName={displayName}
          bio={bio}
          avatarUrl={avatarUrl}
          isAvailable={isUsernameAvailable}
          isCheckingUsername={isCheckingUsername}
          onUsernameChange={handleUsernameChange}
          onDisplayNameChange={setDisplayName}
          onBioChange={setBio}
          onAvatarChange={setAvatarUrl}
          onSubmit={handleSubmit}
          error={error}
          successMessage={successMessage}
          isSubmitting={isSubmitting}
        />

        <EmailSettings
          email={initialUser?.email || ''}
          enableNotifications={emailNotifications}
          onToggleNotifications={handleToggleNotifications}
          userId={initialUser?.id}
        />

        <AccountManagement
          onSignOutEverywhere={handleSignOutEverywhere}
          onDeleteAccount={handleDeleteAccount}
          isDeleting={isDeleting}
        />
      </div>
    </DashboardTemplate>
  );
};

export default SettingsPage;
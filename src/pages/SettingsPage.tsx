import React from 'react';
import DashboardTemplate from '../templates/DashboardTemplate';
import { useAuth } from '../context/auth';
import MobilePageContainer from '../molecules/MobilePageContainer';
import ProfileHeader from '../organisms/Profile/ProfileHeader';
import ProfileForm from '../organisms/Profile/ProfileForm';
import EmailSettings from '../organisms/Settings/EmailSettings';
import AccountManagement from '../organisms/Settings/AccountManagement';
import { useResponsive } from '../hooks/useResponsive';
import { useSetting } from '../hooks/useSetting';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
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
  } = useSetting();

  // Empty handler for email change - will be handled by EmailSettings component
  const handleChangeEmail = () => {};
  
  // Empty handler for sign out everywhere - will be handled by AccountManagement component
  const handleSignOutEverywhere = () => {};

  // Mobile view
  if (isMobile) {
    return (
      <MobilePageContainer showHeader={true}>
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
            email={user?.email || ''}
            enableNotifications={emailNotifications}
            onToggleNotifications={handleToggleNotifications}
            onChangeEmail={handleChangeEmail}
            userId={user?.id}
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
          email={user?.email || ''}
          enableNotifications={emailNotifications}
          onToggleNotifications={handleToggleNotifications}
          onChangeEmail={handleChangeEmail}
          userId={user?.id}
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
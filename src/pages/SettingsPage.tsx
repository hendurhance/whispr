import React, { useState, useEffect, useRef } from 'react';
import DashboardTemplate from '../templates/DashboardTemplate';
import { useAuth } from '../context/auth';
import MobilePageContainer from '../molecules/MobilePageContainer';
import supabase from '../lib/supabase';
import ProfileHeader from '../organisms/Profile/ProfileHeader';
import ProfileForm from '../organisms/Profile/ProfileForm';
import EmailSettings from '../organisms/Settings/EmailSettings';
import AccountManagement from '../organisms/Settings/AccountManagement';
import { useNavigate } from 'react-router-dom';
import CONFIGURATIONS from '../configs';

const SettingsPage: React.FC = () => {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const navigate = useNavigate();
  // Keep track of previous avatar URL to detect changes
  const prevAvatarUrlRef = useRef('');

  // Initialize form with profile data
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (user) {
      // Use user metadata as fallback
      setUsername(user.user_metadata?.username || '');
      setAvatarUrl(user.user_metadata?.avatar_url || '');
      prevAvatarUrlRef.current = user.user_metadata?.avatar_url || '';

      // If profile exists, use that data
      if (profile) {
        console.log('Profile found:', profile);
        setUsername(profile.username || '');
        setDisplayName(profile.display_name || '');
        setBio(profile.bio || '');
        setAvatarUrl(profile.avatar_url || '');
        prevAvatarUrlRef.current = profile.avatar_url || '';

        // Set email notification preference
        if (profile) {
          setEmailNotifications(profile.email_notifications ?? true);
        }
      }
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [user, profile]);

  // Function to check username availability
  const checkUsernameAvailability = async (value: string) => {
    if (!value || !user || value === profile?.username || value === user.user_metadata?.username) {
      setIsUsernameAvailable(null);
      return;
    }

    if (value.length < 3) {
      setIsUsernameAvailable(false);
      return;
    }

    setIsCheckingUsername(true);
    try {
      // Check if username follows valid pattern
      const isValidFormat = /^[a-zA-Z0-9_]+$/.test(value);
      if (!isValidFormat) {
        setIsUsernameAvailable(false);
        return;
      }

      // Check if username exists in database
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', value.toLowerCase())
        .neq('user_id', user?.id || '')
        .single();

      // Username is available if no data returned or error is "no rows returned"
      setIsUsernameAvailable(error?.code === 'PGRST116' || !data);
    } catch (error) {
      console.error('Error checking username:', error);
      setIsUsernameAvailable(false);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // Handle username change with debounce
  const handleUsernameChange = (value: string) => {
    setUsername(value);

    // Debounce check
    const timer = setTimeout(() => {
      checkUsernameAvailability(value);
    }, 500);

    return () => clearTimeout(timer);
  };

  // Save profile changes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (!isUsernameAvailable && username !== profile?.username && username !== user?.user_metadata?.username) {
      setError('Username is not available');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Check if avatar URL has changed
      const avatarChanged = avatarUrl !== prevAvatarUrlRef.current;
      console.log('Avatar changed:', avatarChanged, 'New:', avatarUrl, 'Old:', prevAvatarUrlRef.current);

      // If profile exists, update it
      if (profile && user) {
        // Update profile in database
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            username: username.toLowerCase(),
            display_name: displayName || username,
            bio,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      } else if (user) {
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            user_id: user.id,
            username: username.toLowerCase(),
            display_name: displayName || username,
            bio,
            avatar_url: avatarUrl,
            created_at: new Date().toISOString()
          }]);

        if (insertError) throw insertError;
      }

      // Always update user metadata
      if (user) {
        // Update user metadata
        const { error: userUpdateError } = await supabase.auth.updateUser({
          data: {
            profile_setup: true,
            username: username.toLowerCase(),
            avatar_url: avatarUrl
          }
        });

        if (userUpdateError) throw userUpdateError;

        // Update local storage
        localStorage.setItem('profile_setup', 'true');

        // Update ref to new avatar URL
        prevAvatarUrlRef.current = avatarUrl;
      }

      // Force refresh profile data to get the latest changes
      await refreshProfile();

      setSuccessMessage('Profile updated successfully!');

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile. Please try again.';
      console.error('Error updating profile:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle email change - opens modal
  const handleChangeEmail = () => {
    // This will now open the EmailChangeModal defined in EmailSettings
  };

  // Toggle email notifications
  const handleToggleNotifications = async () => {
    setEmailNotifications(!emailNotifications);
    // Notification state is now handled in the EmailSettings component with proper database updates

    // Refresh profile to get updated notification preferences
    setTimeout(() => {
      refreshProfile();
    }, 500);
  };

  // Sign out from all devices
  const handleSignOutEverywhere = () => {
    // Implementation is now in AccountManagement component
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!user) return;

    setIsDeleting(true);
    setError(null);

    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Not authenticated');
      }


      const response = await fetch(
        CONFIGURATIONS.FUNCTIONS.DELETE_USER,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          method: 'POST',
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || `Server responded with ${response.status}`);
      }

      // Handle soft delete case
      if (responseData.softDelete) {
        console.log("Account was anonymized but not fully deleted due to database constraints");
      }

      await signOut();

      navigate('/');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete account. Please try again.';
      console.error('Error deleting account:', error);
      setError(errorMessage);
      setIsDeleting(false);
    }
  };

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
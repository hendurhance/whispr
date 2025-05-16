import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase';
import DashboardTemplate from '../templates/DashboardTemplate';
import { useAuth } from '../context/auth';

const SetupProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  // Get current user on component mount and setup default avatar
  useEffect(() => {
    const fetchUser = async () => {
      // If we're using the auth context, we can use the user from there
      if (authUser) {
        setUser(authUser);

        // If user already has profile setup, redirect to dashboard
        if (authUser.user_metadata?.profile_setup) {
          navigate('/dashboard', { replace: true });
          return;
        }
      } else {
        // Fallback to direct Supabase call
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
          // If no user, redirect to auth page
          navigate('/auth', { replace: true });
          return;
        }

        setUser(data.user);

        // If user already has profile setup, redirect to dashboard
        if (data.user.user_metadata?.profile_setup) {
          navigate('/dashboard', { replace: true });
        }
      }
    };

    fetchUser();

    generateDefaultAvatar();
  }, [navigate, authUser]);

  const generateDefaultAvatar = (seed?: string) => {
    const avatarSeed = seed || Math.random().toString(36).substring(2, 10);
    const dicebearUrl = `https://api.dicebear.com/9.x/personas/svg?seed=${avatarSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
    setAvatarPreview(dicebearUrl);
    setAvatarUrl(dicebearUrl);
  };

  // Function to check username availability
  const checkAvailability = async (value: string) => {
    if (!value || value.length < 3) {
      setIsAvailable(false);
      return;
    }

    setIsChecking(true);
    try {
      // Check if username follows valid pattern
      const isValidFormat = /^[a-zA-Z0-9_]+$/.test(value);
      if (!isValidFormat) {
        setIsAvailable(false);
        return;
      }

      // Check if username exists in database
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', value.toLowerCase())
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw error;
      }

      // Username is available if no data returned
      setIsAvailable(!data);
    } catch (error) {
      console.error('Error checking username:', error);
      setIsAvailable(false);
    } finally {
      setIsChecking(false);
    }
  };

  // Debounced username check
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);

    if (value.length === 0) {
      setIsAvailable(null);
      return;
    }

    // Debounce check to avoid too many API calls
    const timer = setTimeout(() => {
      checkAvailability(value);
    }, 500);

    return () => clearTimeout(timer);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAvailable || !username || !user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // First, insert the profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: user.id,
            username: username.toLowerCase(),
            display_name: username,
            bio: bio,
            avatar_url: avatarUrl,
            created_at: new Date().toISOString()
          }
        ]);

      if (profileError) throw profileError;

      // Then, update user metadata to mark profile as set up
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          profile_setup: true,
          username: username.toLowerCase(),
          avatar_url: avatarUrl
        }
      });

      if (updateError) throw updateError;

      // Update local storage
      localStorage.setItem('profile_setup', 'true');

      // Redirect to dashboard on success
      navigate('/dashboard', { replace: true });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to set up profile. Please try again.';
      console.error('Error setting up profile:', error);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardTemplate>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-bright mb-4">Set Up Your Profile</h1>
          <p className="text-text-muted">
            Choose a username and customize your profile to complete your account setup.
            This will be your personal Whispr link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Username Input */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-text-bright mb-2">
              Username <span className="text-accent-pink">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                @
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                placeholder="yourname"
                className={`w-full pl-10 pr-12 py-3 rounded-xl bg-background-darkest border transition-colors text-text-bright placeholder-text-muted ${isAvailable === true
                    ? 'border-accent-green focus:border-accent-green focus:ring-1 focus:ring-accent-green'
                    : isAvailable === false
                      ? 'border-accent-pink focus:border-accent-pink focus:ring-1 focus:ring-accent-pink'
                      : 'border-overlay-light focus:border-primary focus:ring-1 focus:ring-primary'
                  }`}
                required
                minLength={3}
                maxLength={20}
                pattern="[a-zA-Z0-9_]+"
                title="Only letters, numbers, and underscores are allowed"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                {isChecking ? (
                  <svg className="animate-spin h-5 w-5 text-text-muted" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : isAvailable === true ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-green" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : isAvailable === false ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-pink" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                ) : null}
              </div>
            </div>
            <div className="mt-2 flex items-center">
              {username && (
                <>
                  {isAvailable === true && (
                    <p className="text-sm text-accent-green">Username is available!</p>
                  )}
                  {isAvailable === false && (
                    <p className="text-sm text-accent-pink">Username is not available or invalid.</p>
                  )}
                </>
              )}
            </div>
            <div className="mt-3">
              <p className="text-sm text-text-muted">
                Your Whispr link will be:
                <span className="ml-1 text-text-bright">
                  trywhispr.me/{username || 'yourname'}
                </span>
              </p>
            </div>
          </div>

          {/* Avatar Preview and Generation */}
          <div>
            <label className="block text-sm font-medium text-text-bright mb-2">
              Profile Picture
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar Preview */}
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-overlay-light bg-background-card flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">👤</span>
                )}
              </div>

              {/* Generate Random Avatar Button */}
              <div className="flex flex-col gap-3 w-full">
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-2 border border-overlay-light rounded-xl cursor-pointer bg-background-card hover:bg-background-highlight transition-colors text-text-bright"
                  onClick={() => generateDefaultAvatar(Math.random().toString(36).substring(2, 10))}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Generate Random Avatar
                </button>

                <p className="text-xs text-text-muted">
                  Generate a random avatar for your profile.
                </p>
              </div>
            </div>
          </div>

          {/* Bio Input */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-text-bright mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others a bit about yourself..."
              className="w-full px-4 py-3 rounded-xl bg-background-darkest border border-overlay-light focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-text-bright placeholder-text-muted"
              rows={3}
              maxLength={160}
            />
            <p className="mt-2 text-xs text-text-muted text-right">
              {bio.length}/160 characters
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-accent-pink/10 text-accent-pink rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isAvailable || isSubmitting}
            className={`w-full py-3 px-4 bg-gradient-primary text-white rounded-xl font-medium transition-all ${!isAvailable || isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-glow'
              }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Setting Up Profile...
              </span>
            ) : (
              'Continue to Dashboard'
            )}
          </button>
        </form>
      </div>
    </DashboardTemplate>
  );
};

export default SetupProfilePage;
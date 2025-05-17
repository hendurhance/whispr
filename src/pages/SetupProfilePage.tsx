import React from 'react';
import DashboardTemplate from '../templates/DashboardTemplate';
import { getUsernameLink } from '../hooks/getUsernameLink';
import { useProfileSetup } from '../hooks/useProfileSetup';

const SetupProfilePage: React.FC = () => {
  const {
    // Form state
    username,
    bio,
    avatarPreview,
    
    // UI state
    isAvailable,
    isChecking,
    isSubmitting,
    error,
    
    // Handlers
    handleUsernameChange,
    setBio,
    generateDefaultAvatar,
    handleSubmit
  } = useProfileSetup();

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
                className={`w-full pl-10 pr-12 py-3 rounded-xl bg-background-darkest border transition-colors text-text-bright placeholder-text-muted ${
                  isAvailable === true
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
                aria-describedby="username-status"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                {isChecking ? (
                  <svg className="animate-spin h-5 w-5 text-text-muted" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : isAvailable === true ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-green" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : isAvailable === false ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-pink" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                ) : null}
              </div>
            </div>
            <div id="username-status" className="mt-2">
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
                  {getUsernameLink(username || 'yourname')}
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
                  <span className="text-4xl" aria-label="Default avatar">👤</span>
                )}
              </div>

              {/* Generate Random Avatar Button */}
              <div className="flex flex-col gap-3 w-full">
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-2 border border-overlay-light rounded-xl cursor-pointer bg-background-card hover:bg-background-highlight transition-colors text-text-bright focus:outline-none focus:ring-2 focus:ring-primary/50"
                  onClick={() => generateDefaultAvatar(Math.random().toString(36).substring(2, 10))}
                  aria-label="Generate a new random avatar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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
              aria-describedby="bio-char-count"
            />
            <p id="bio-char-count" className="mt-2 text-xs text-text-muted text-right">
              {bio.length}/160 characters
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-accent-pink/10 text-accent-pink rounded-lg p-3 text-sm" role="alert">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isAvailable || isSubmitting}
            className={`w-full py-3 px-4 bg-gradient-primary text-white rounded-xl font-medium transition-all ${
              !isAvailable || isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-glow'
            }`}
            aria-disabled={!isAvailable || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
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
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Logo from '../atoms/Logo';
import FooterSimple from '../organisms/Shared/FooterSimple';
import WhisprSubmissionForm from '../organisms/PublicProfile/WhisprSubmissionForm';
import usePublicProfile from '../hooks/usePublicProfile';
import useProfileTheme from '../hooks/useProfileTheme';
import PublicProfileCard from '../organisms/PublicProfile/PublicProfileCard';

const PublicProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const { 
    profile, 
    isLoading, 
    error, 
    submitSuccess, 
    setSubmitSuccess,
    submitWhispr,
    handleSubmitSuccess,
    handleSubmitError
  } = usePublicProfile({ username });
  
  // If profile exists, apply theme and background
  const { themeGradientClass, backgroundClass } = useProfileTheme({
    theme: profile?.selectedTheme,
    background: profile?.selectedBackground,
    applyBodyBackground: true
  });
  
  // Loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${backgroundClass}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }
  
  // Error state
  if (error || !profile) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${backgroundClass} text-white p-6`}>
        <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
        <p className="text-gray-400 mb-6">This username doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-white text-black rounded-lg font-medium"
        >
          Go Home
        </button>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen flex flex-col ${backgroundClass}`}>
      {/* Header with Logo */}
      <header className="py-4 px-6 flex justify-between items-center">
        <Logo />
        <Link to="/" className="text-text-muted hover:text-text-bright text-sm">
          Create your own
        </Link>
      </header>
      
      <div className="flex-1 flex items-center justify-center p-6">
        {profile.allowAnonymous ? (
          <>
            {submitSuccess ? (
              // Success message
              <div className="max-w-md w-full bg-background-card rounded-xl border border-overlay-light p-6 text-center">
                <div className="text-4xl mb-4">✓</div>
                <h2 className="text-lg font-semibold text-text-bright mb-2">Whispr Sent!</h2>
                <p className="text-text-muted">Your anonymous message has been delivered successfully.</p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-4 px-4 py-2 bg-gradient-primary text-white rounded-lg"
                >
                  Send Another
                </button>
              </div>
            ) : (
              // Profile card and submission form
              <div className="flex flex-col items-center w-full max-w-md">
                <PublicProfileCard
                  username={profile.username}
                  displayName={profile.displayName}
                  avatarUrl={profile.avatarUrl}
                  bio={profile.bio}
                  totalWhisprs={profile.totalWhisprs}
                  displaySocialLinks={profile.displaySocialLinks}
                  socialLinks={profile.socialLinks}
                  themeGradientClass={themeGradientClass}
                  allowAnonymous={profile.allowAnonymous}
                  className="mb-6 w-full"
                />
                
                <WhisprSubmissionForm
                  username={profile.username}
                  onSuccess={handleSubmitSuccess}
                  onError={handleSubmitError}
                  className="w-full"
                  submitWhispr={submitWhispr}
                />
              </div>
            )}
          </>
        ) : (
          // Profile with anonymous messages disabled
          <PublicProfileCard
            username={profile.username}
            displayName={profile.displayName}
            avatarUrl={profile.avatarUrl}
            bio={profile.bio}
            totalWhisprs={profile.totalWhisprs}
            displaySocialLinks={profile.displaySocialLinks}
            socialLinks={profile.socialLinks}
            themeGradientClass={themeGradientClass}
            allowAnonymous={profile.allowAnonymous}
          />
        )}
      </div>
      
      <FooterSimple />
    </div>
  );
};

export default PublicProfilePage;
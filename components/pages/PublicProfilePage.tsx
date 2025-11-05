'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Logo from '@/components/atoms/Logo';
import FooterSimple from '@/components/organisms/Shared/FooterSimple';
import WhisprSubmissionForm from '@/components/organisms/PublicProfile/WhisprSubmissionForm';
import useProfileTheme from '@/hooks/useProfileTheme';
import PublicProfileCard from '@/components/organisms/PublicProfile/PublicProfileCard';
import CONFIGURATIONS from '@/configs';

interface PublicProfileData {
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  totalWhisprs: number;
  displaySocialLinks: boolean;
  socialLinks: Array<{
    id: string;
    platform: string;
    url: string;
    displayOrder: number;
  }>;
  allowAnonymous: boolean;
  showQuestionTypes: boolean;
  selectedTheme: string;
  selectedBackground: string;
}

interface PublicProfilePageProps {
  initialProfile: PublicProfileData | null;
  username: string;
}

const PublicProfilePage: React.FC<PublicProfilePageProps> = ({ initialProfile, username }) => {
  const router = useRouter();
  const [profile, setProfile] = useState<PublicProfileData | null>(initialProfile);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Apply theme styles
  const { themeGradientStyle, backgroundStyle } = useProfileTheme({
    theme: profile?.selectedTheme,
    background: profile?.selectedBackground,
    applyBodyBackground: true
  });

  // Submit a whispr via edge function
  const submitWhispr = async (content: string, type: string) => {
    const response = await fetch(CONFIGURATIONS.FUNCTIONS.SUBMIT_WHISPR, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, content, type })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit whispr');
    }
    
    return data;
  };

  // Update whispr count after submission
  const updateWhisprCount = async () => {
    try {
      const response = await fetch(CONFIGURATIONS.FUNCTIONS.UPDATE_WHISPR_COUNTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return null;
      }
      
      return data.whisprs;
    } catch (error) {
      console.error('Error updating whispr count:', error);
      return null;
    }
  };

  // Handle successful whispr submission
  const handleSubmitSuccess = async () => {
    setSubmitSuccess(true);
    toast.success('Your whispr has been sent!');
    
    // Update whispr count via edge function
    if (profile) {
      const newWhisprCount = await updateWhisprCount();
      
      if (newWhisprCount !== null) {
        setProfile({
          ...profile,
          totalWhisprs: newWhisprCount
        });
      } else {
        // If edge function failed, just increment locally
        setProfile({
          ...profile,
          totalWhisprs: profile.totalWhisprs + 1
        });
      }
    }
    
    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 3000);
  };

  // Handle error in whispr submission
  const handleSubmitError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'Failed to send whispr';
    toast.error(errorMessage);
    console.error('Whispr submission error:', error);
  };

  // Error state (no profile found)
  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white p-6" style={backgroundStyle}>
        <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
        <p className="text-gray-400 mb-6">This username doesn't exist or has been removed.</p>
        <button 
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-white text-black rounded-lg font-medium"
        >
          Go Home
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col" style={backgroundStyle}>
      {/* Header with Logo */}
      <header className="py-4 px-6 flex justify-between items-center">
        <Logo />
        <Link href="/" className="text-text-muted hover:text-text-bright text-sm">
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
                  themeGradientStyle={themeGradientStyle}
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
            themeGradientStyle={themeGradientStyle}
            allowAnonymous={profile.allowAnonymous}
          />
        )}
      </div>
      
      <FooterSimple />
    </div>
  );
};

export default PublicProfilePage;
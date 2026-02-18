'use client';

import  { useState } from 'react';
import WhisprSubmissionForm from '../PublicProfile/WhisprSubmissionForm';
import useProfileTheme from '@/hooks/useProfileTheme';
import PublicProfileCard from '../PublicProfile/PublicProfileCard';

/**
 * Demo/showcase profile view for app previews
 */
const ProfileView = () => {
  const [profile] = useState({
    username: "whispr",
    displayName: "Whispr Demo",
    avatarUrl: null,
    bio: "Send me your wildest anonymous messages! I promise I won't judge... much.",
    totalWhisprs: 42,
    displaySocialLinks: true,
    socialLinks: [
      { id: "1", platform: "Twitter", url: "#", displayOrder: 1 },
      { id: "2", platform: "Instagram", url: "#", displayOrder: 2 },
      { id: "3", platform: "TikTok", url: "#", displayOrder: 3 }
    ],
    allowAnonymous: true,
    showQuestionTypes: true,
    selectedTheme: "purple-pink",
    selectedBackground: "black"
  });
  
  const { themeGradientStyle, backgroundStyle } = useProfileTheme({
    theme: profile.selectedTheme,
    background: profile.selectedBackground
  });

  const submitWhispr = () => {};

  const handleSuccess = () => {};
  
  return (
    <div className="min-h-screen flex flex-col" style={backgroundStyle}>
      <div className="flex-1 flex flex-col items-center justify-center">
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
          variant="showcase"
          className="mb-6"
        />
        
        <WhisprSubmissionForm
          username={profile.username}
          onSuccess={handleSuccess}
          onError={() => console.error('Error submitting whispr')}
          className='max-w-md w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700'
          submitWhispr={submitWhispr}
        />
      </div>
    </div>
  );
};

export default ProfileView;
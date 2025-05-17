import { useState } from 'react';
import WhisprSubmissionForm from '../PublicProfile/WhisprSubmissionForm';

const ProfileView = () => {
  // Sample profile data
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
  
  // Get theme gradient class based on selected theme
  const getThemeGradient = (theme: string) => {
    switch (theme) {
      case 'purple-pink': return 'bg-gradient-to-r from-purple-600 to-pink-500';
      case 'blue-teal': return 'bg-gradient-to-r from-blue-500 to-teal-400';
      case 'orange-red': return 'bg-gradient-to-r from-orange-500 to-red-500';
      case 'green-cyan': return 'bg-gradient-to-r from-green-500 to-cyan-400';
      case 'indigo-purple': return 'bg-gradient-to-r from-indigo-500 to-purple-500';
      default: return 'bg-gradient-to-r from-purple-600 to-pink-500';
    }
  };
  
  // Get background color based on the profile's selectedBackground
  const getBackgroundColor = (backgroundType: string) => {
    switch (backgroundType) {
      case 'black': return 'bg-black';
      case 'dark-gray': return 'bg-zinc-900';
      case 'navy': return 'bg-blue-950';
      case 'dark-purple': return 'bg-purple-950';
      default: return 'bg-black'; // Default background
    }
  };
  

  // Simulate form submission (disabled for showcase)
  const handleSubmit = () => {
    alert('This is a showcase, submission is disabled!');
  };
  
  const pageBackground = getBackgroundColor(profile.selectedBackground);
  
  return (
    <div className={`min-h-screen flex flex-col ${pageBackground}`}>
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Profile Card */}
        <div className="max-w-md w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700 mb-6">
          <div className={`h-20 ${getThemeGradient(profile.selectedTheme)}`}></div>
          <div className="p-6 relative">
            <div className="absolute -top-10 left-6">
              <div className="w-20 h-20 rounded-full border-4 border-zinc-900 overflow-hidden bg-zinc-800">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.displayName || profile.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl text-white">
                    {(profile.displayName || profile.username).charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-10">
              <h1 className="text-xl font-bold text-white">{profile.displayName || profile.username}</h1>
              <p className="text-gray-400">@{profile.username}</p>
              
              {profile.bio && (
                <p className="mt-4 text-white">{profile.bio}</p>
              )}
              
              <div className="mt-4 text-gray-400 text-sm">
                {profile.totalWhisprs} {profile.totalWhisprs === 1 ? 'whispr' : 'whisprs'} received
              </div>
              
              {profile.displaySocialLinks && profile.socialLinks.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Connect with me</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.socialLinks.map((link) => (
                      <div
                        key={link.id}
                        className="px-3 py-1 rounded-full text-sm bg-zinc-800 text-white hover:bg-zinc-700 transition-colors cursor-pointer"
                      >
                        {link.platform}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Submission Form */}
        <WhisprSubmissionForm
          username={profile.username}
          onSuccess={handleSubmit}
          onError={() => console.error('Error submitting whispr')}
          className='max-w-md w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700'
          submitWhispr={handleSubmit}
          />
      </div>
    </div>
  );
};

export default ProfileView;
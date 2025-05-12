import React from 'react';
import PhoneStatusBar from '../../atoms/PhoneStatusBar';

interface ProfileViewProps {
  username: string;
  profileImage?: string;
  promptText?: string;
  placeholderText?: string;
  counterText?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({
  username,
  profileImage,
  promptText = 'send me anonymous messages!',
  placeholderText = 'send me anonymous messages...',
  counterText = '366 people just tapped the button',
  buttonText = 'Get your own messages!',
  onButtonClick
}) => {
  return (
    <div className="bg-gradient-to-br from-primary to-secondary flex flex-col h-full">
      {/* Top Bar */}
      <PhoneStatusBar />
      
      {/* Profile Section */}
      <div className="flex flex-col items-center px-6 py-8">
        <div className="w-20 h-20 rounded-full bg-white/20 mb-3 flex items-center justify-center overflow-hidden">
          {profileImage ? (
            <img src={profileImage} alt={username} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl">👤</span>
          )}
        </div>
        <div className="text-white font-bold text-xl mb-1">@{username}</div>
        <div className="bg-black/30 text-white font-bold px-5 py-2 rounded-full text-center mb-4">
          {promptText}
        </div>
      </div>
      
      {/* Message Input Box */}
      <div className="mx-6 bg-white/20 backdrop-blur-lg p-6 rounded-2xl mb-4">
        <div className="text-white/70 text-lg mb-6">
          {placeholderText}
        </div>
        <div className="flex justify-end">
          <div className="bg-white/30 rounded-full p-2 w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-white/40 transition-colors">
            <span className="text-white text-xl">→</span>
          </div>
        </div>
      </div>
      
      {/* Anonymous Label */}
      <div className="flex justify-center">
        <div className="bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full flex items-center gap-2">
          <span className="text-white">🔒</span>
          <span className="text-white text-sm">anonymous q&a</span>
        </div>
      </div>
      
      {/* Counter */}
      <div className="mt-auto mb-4 px-6">
        <div className="text-white text-center my-4">
          <span className="mr-1">👆</span>
          <span className="font-bold">{counterText}</span>
          <span className="ml-1">👆</span>
        </div>
        <button 
          className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-black/80 transition-colors"
          onClick={onButtonClick}
        >
          {buttonText}
        </button>
      </div>
      
      {/* Footer */}
      <div className="flex justify-center gap-4 pb-4">
        <span className="text-white/70 text-sm hover:text-white cursor-pointer">Terms</span>
        <span className="text-white/70 text-sm hover:text-white cursor-pointer">Privacy</span>
      </div>
    </div>
  );
};

export default ProfileView;
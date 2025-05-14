import React from 'react';

interface ProfileCardProps {
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  className?: string;
  onEditProfile?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  username,
  displayName,
  avatarUrl,
  bio,
  className = '',
  onEditProfile
}) => {
  return (
    <div className={`bg-background-card rounded-xl border border-overlay-light p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-text-bright mb-4">Profile Preview</h2>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-primary flex items-center justify-center text-white text-xl font-medium">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-text-bright font-semibold">{displayName || username}</h3>
          <p className="text-text-muted text-sm">@{username}</p>
        </div>
      </div>
      
      {bio && (
        <div className="mb-4">
          <p className="text-text-bright">{bio}</p>
        </div>
      )}
      
      {onEditProfile && (
        <button
          onClick={onEditProfile}
          className="text-primary hover:text-primary-light transition-colors text-sm"
        >
          Edit profile
        </button>
      )}
    </div>
  );
};

export default ProfileCard;
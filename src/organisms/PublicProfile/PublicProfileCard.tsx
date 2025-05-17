import React from 'react';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  displayOrder: number;
}

export interface PublicProfileCardProps {
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  totalWhisprs?: number;
  displaySocialLinks?: boolean;
  socialLinks?: SocialLink[];
  themeGradientClass: string;
  allowAnonymous?: boolean;
  className?: string;
  variant?: 'standard' | 'showcase';
  children?: React.ReactNode;
}

/**
 * Reusable profile card component for both public profile and demo
 */
const PublicProfileCard: React.FC<PublicProfileCardProps> = ({
  username,
  displayName,
  avatarUrl,
  bio,
  totalWhisprs,
  displaySocialLinks = false,
  socialLinks = [],
  themeGradientClass,
  allowAnonymous = true,
  className = '',
  variant = 'standard',
  children
}) => {
  // Get the appropriate style classes based on variant
  const getStyleClasses = () => {
    if (variant === 'showcase') {
      return {
        card: 'bg-zinc-900 border-zinc-700',
        avatar: 'border-zinc-900 bg-zinc-800',
        title: 'text-white',
        username: 'text-gray-400',
        bio: 'text-white',
        stats: 'text-gray-400',
        social: {
          title: 'text-gray-400',
          link: 'bg-zinc-800 text-white hover:bg-zinc-700'
        }
      };
    }
    
    // Standard variant (actual profile)
    return {
      card: 'bg-background-card border-overlay-light',
      avatar: 'border-background-card bg-background-highlight',
      title: 'text-text-bright',
      username: 'text-text-muted',
      bio: 'text-text-bright',
      stats: 'text-text-muted',
      social: {
        title: 'text-text-muted',
        link: 'bg-background-highlight text-text-bright hover:bg-background-lighter'
      }
    };
  };
  
  const styles = getStyleClasses();
  
  return (
    <div className={`max-w-md w-full rounded-xl overflow-hidden ${styles.card} ${className}`}>
      {/* Theme gradient banner */}
      <div className={`h-20 ${themeGradientClass}`}></div>
      
      <div className="p-6 relative">
        {/* Avatar */}
        <div className="absolute -top-10 left-6">
          <div className={`w-20 h-20 rounded-full border-4 ${styles.avatar} overflow-hidden`}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName || username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl text-white">
                {(displayName || username).charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
        
        {/* Profile info */}
        <div className="mt-10">
          <h1 className={`text-xl font-bold ${styles.title}`}>{displayName || username}</h1>
          <p className={styles.username}>@{username}</p>
          
          {bio && (
            <p className={`mt-4 ${styles.bio}`}>{bio}</p>
          )}
          
          {/* Whispr count if available */}
          {typeof totalWhisprs !== 'undefined' && (
            <div className={`mt-4 text-sm ${styles.stats}`}>
              {totalWhisprs} {totalWhisprs === 1 ? 'whispr' : 'whisprs'} received
            </div>
          )}
          
          {/* Anonymous messages disabled notice */}
          {!allowAnonymous && (
            <div className="mt-6 text-center">
              <p className={`mb-2 ${styles.title}`}>Anonymous messages are disabled</p>
              <p className={`text-sm ${styles.username}`}>
                {displayName || username} is not accepting anonymous whisprs at this time.
              </p>
            </div>
          )}
          
          {/* Social links */}
          {displaySocialLinks && socialLinks.length > 0 && (
            <div className="mt-6">
              <h3 className={`text-sm font-medium ${styles.social.title} mb-2`}>Connect with me</h3>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${styles.social.link}`}
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {/* Optional additional content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default PublicProfileCard;
import React, { useState } from 'react';
import Badge from '../atoms/Badge';
import { getTimeOfDay } from '../types/whispr';
import { useAuth } from '../context/auth';
import { toast } from 'react-hot-toast';
import { getUsernameLink } from '../hooks/getUsernameLink';

interface DashboardHeaderProps {
  displayName: string;
  unreadCount: number;
  avatarUrl?: string;
  className?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  displayName, 
  unreadCount,
  avatarUrl,
  className = ''
}) => {
  const timeOfDay = getTimeOfDay();
  const { profile, user } = useAuth();
  const [shareButtonText, setShareButtonText] = useState<string>("Share Your Link");
  
  // Get username for the profile link
  const username = profile?.username || user?.user_metadata?.username || 'username';
  const profileLink = getUsernameLink(username);
  
  // Handle share link click
  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(profileLink);

      toast.success('Your link has been copied to clipboard!');

      setShareButtonText("Copied!");

      setTimeout(() => {
        setShareButtonText("Share Your Link");
      }, 2000);
      
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy link to clipboard');

      if (typeof window !== 'undefined') {
        try {
          window.prompt('Copy your link:', profileLink);
          toast.success('Please copy your link from the popup');
        } catch (promptError) {
          toast.error('Unable to share link');
        }
      }
    }
  };

  return (
    <header className={`flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background-card rounded-xl p-5 mb-6 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-primary flex items-center justify-center text-white text-xl font-medium">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-text-bright">
            Good {timeOfDay}, {displayName}!
          </h1>
          {unreadCount > 0 ? (
            <p className="text-text-muted flex items-center gap-2">
              You have <Badge count={unreadCount} variant="accent" /> new whisprs waiting for you
            </p>
          ) : (
            <p className="text-text-muted">
              Welcome to your dashboard
            </p>
          )}
        </div>
      </div>
      
      <div className="flex gap-2 self-end md:self-auto">
        <button 
          onClick={handleShareLink}
          className="px-4 py-2 rounded-lg bg-background-highlight text-text-bright hover:bg-overlay-light transition-colors"
        >
          <span className="mr-2">🔗</span>
          {shareButtonText}
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
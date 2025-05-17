import React from 'react';
import { Whispr } from '../types/whispr';
import WhisprCard from './WhisprCard';
import EmptyState from '../atoms/EmptyState';
import { useCardNavigation } from '../hooks/useCardNavigation';
import { useAuth } from '../context/auth';
import { getUsernameLink } from '../hooks/getUsernameLink';
import { useShareLink } from '../hooks/useShareLink';
import { toast } from 'react-hot-toast';

interface WhisprSwipeCardProps {
  whisprs: Whispr[];
  onView?: (whispr: Whispr) => void;
  onShare?: (whispr: Whispr) => void;
  onDelete?: (whisprId: string) => void;
  className?: string;
  resetFilters?: () => void;
  isFiltered?: boolean;
}

/**
 * Card-based view for whisprs with swipe navigation
 */
const WhisprSwipeCard: React.FC<WhisprSwipeCardProps> = ({ 
  whisprs, 
  onView,
  onShare,
  onDelete,
  className = '',
  resetFilters,
  isFiltered = false
}) => {
  // Get user profile for sharing link
  const { profile, user } = useAuth();
  
  // Use the shareLink hook
  const { copied, shareLink } = useShareLink();
  
  // Get username for the profile link
  const username = profile?.username || user?.user_metadata?.username || 'username';
  const profileLink = getUsernameLink(username);
  
  // Handle share link click
  const handleShareLink = async () => {
    const success = await shareLink(profileLink, {
      title: `Send me anonymous messages`,
      text: `Send me anonymous messages on Whispr`,
      copyFallback: true
    });
    
    if (success) {
      toast.success('Your link has been shared!');
    }
  };

  const { 
    currentIndex,
    goToNextCard,
    goToPrevCard,
    hasPrevious,
    hasNext,
    totalCount,
    currentItem
  } = useCardNavigation({ whisprs, enableSwipe: false });
  
  // Show empty state when there are no whisprs
  if (whisprs.length === 0) {
    return (
      <EmptyState
        icon={isFiltered ? "🔍" : "📭"}
        title={isFiltered ? "No results found" : "No whisprs yet"}
        description={
          isFiltered
            ? "No whisprs match your current filters"
            : "Share your unique link with friends to start receiving anonymous whisprs."
        }
        action={
          isFiltered && resetFilters ? (
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gradient-primary text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              Clear filters
            </button>
          ) : (
            <button 
              onClick={handleShareLink}
              className="px-4 py-2 bg-gradient-primary text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {copied ? "Link Copied!" : "Share my link"}
            </button>
          )
        }
      />
    );
  }
  
  return (
    <div className={`relative ${className}`}>
      <div className="py-8">
        <WhisprCard
          whispr={currentItem}
          viewMode="card"
          onView={onView}
          onShare={onShare}
          onDelete={onDelete}
        />
      </div>
      
      <div className="mt-6 flex items-center justify-between">
        <button 
          onClick={goToPrevCard}
          disabled={!hasPrevious}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            !hasPrevious
              ? 'bg-overlay-light text-text-muted cursor-not-allowed' 
              : 'bg-background-card text-text-bright hover:bg-background-highlight'
          }`}
          aria-label="Previous card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-text-muted text-sm">
          {currentIndex + 1} of {totalCount}
        </div>
        
        <button 
          onClick={goToNextCard}
          disabled={!hasNext}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            !hasNext
              ? 'bg-overlay-light text-text-muted cursor-not-allowed' 
              : 'bg-background-card text-text-bright hover:bg-background-highlight'
          }`}
          aria-label="Next card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Add reset filters button when filters are applied */}
      {isFiltered && resetFilters && (
        <div className="mt-4 text-center">
          <button 
            onClick={resetFilters}
            className="text-xs px-3 py-1 rounded-full bg-background-highlight text-text-bright hover:bg-background-card transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
};

export default WhisprSwipeCard;
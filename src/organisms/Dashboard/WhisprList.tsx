import React from 'react';
import { ViewMode, Whispr } from '../../types/whispr';
import EmptyState from '../../atoms/EmptyState';
import WhisprCard from '../../molecules/WhisprCard';
import { useAuth } from '../../context/auth';
import { getUsernameLink } from '../../hooks/getUsernameLink';
import { useShareLink } from '../../hooks/useShareLink';
import { toast } from 'react-hot-toast';

interface WhisprListProps {
  whisprs: Whispr[];
  viewMode: ViewMode;
  onView: (whispr: Whispr) => void;
  onShare: (whispr: Whispr) => void;
  onDelete: (whisprId: string) => void;
  isLoading?: boolean;
  searchTerm?: string;
  totalWhisprs?: number;
  resetFilters?: () => void;
  isFiltered?: boolean;
}

/**
 * Component for displaying whisprs in list or grid view
 */
const WhisprList: React.FC<WhisprListProps> = ({
  whisprs,
  viewMode,
  onView,
  onShare,
  onDelete,
  isLoading = false,
  searchTerm = '',
  totalWhisprs,
  resetFilters,
  isFiltered = false
}) => {
  // Get user profile for sharing link
  const { profile, user } = useAuth();
  
  // Use the shareLink hook
  const { copied, shareLink, shareError } = useShareLink();
  
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
    } else if (shareError) {
      toast.error(shareError);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Empty state
  if (whisprs.length === 0) {
    return (
      <EmptyState
        icon={searchTerm ? "🔍" : "📭"}
        title={searchTerm ? "No results found" : "No whisprs yet"}
        description={
          searchTerm 
            ? `No whisprs match your search for "${searchTerm}"`
            : "Share your unique link with friends to start receiving anonymous whisprs"
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

  // Display count information
  const renderCountInfo = () => {
    const hasFiltering = totalWhisprs && whisprs.length !== totalWhisprs;
    
    return (
      <div className="flex justify-between items-center text-text-muted text-sm mb-4">
        <div>
          {whisprs.length} {whisprs.length === 1 ? 'whispr' : 'whisprs'}
          {searchTerm && ` matching "${searchTerm}"`}
          {hasFiltering && ` (filtered from ${totalWhisprs} total)`}
        </div>
        
        {/* Add reset filters button when filters are applied */}
        {isFiltered && resetFilters && (
          <button 
            onClick={resetFilters}
            className="text-xs px-3 py-1 rounded-full bg-background-highlight text-text-bright hover:bg-background-card transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Reset filters
          </button>
        )}
      </div>
    );
  };

  // Determine the appropriate layout class based on view mode
  const getLayoutClass = () => {
    return viewMode === 'grid' 
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
      : 'space-y-4';
  };

  return (
    <div>
      {renderCountInfo()}
      
      <div className={getLayoutClass()}>
        {whisprs.map((whispr) => (
          <WhisprCard
            key={whispr.id}
            whispr={whispr}
            viewMode={viewMode}
            onView={onView}
            onShare={onShare}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default WhisprList;
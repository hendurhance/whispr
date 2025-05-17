import React from 'react';
import { Whispr, WhisprStats } from '../../types/whispr';
import WhisprCard from '../../molecules/WhisprCard';
import EmptyState from '../../atoms/EmptyState';
import MobileNavigationTabs from '../../molecules/MobileNavigationTabs';
import Badge from '../../atoms/Badge';
import FilterControls from '../../molecules/FilterControl';
import { useWhisprFiltering } from '../../hooks/useWhisprFiltering';
import { useCardNavigation } from '../../hooks/useCardNavigation';
import { useAuth } from '../../context/auth';
import { getUsernameLink } from '../../hooks/getUsernameLink';
import { useShareLink } from '../../hooks/useShareLink';
import { toast } from 'react-hot-toast';

interface MobileWhisprViewProps {
  whisprs: Whispr[];
  stats: WhisprStats;
  displayName: string;
  avatarUrl?: string;
  onView: (whispr: Whispr) => void;
  onShare: (whispr: Whispr) => void;
  onDelete: (whisprId: string) => void;
  className?: string;
}

/**
 * Mobile-optimized view for whisprs with filtering and card swiping
 */
const MobileWhisprView: React.FC<MobileWhisprViewProps> = ({
  whisprs,
  stats,
  displayName,
  avatarUrl,
  onView,
  onShare,
  onDelete,
  className = ''
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

  // Use the unified filtering hook
  const {
    viewMode,
    setViewMode,
    selectedType,
    setSelectedType,
    sortOption,
    setSortOption,
    searchTerm,
    setSearchTerm,
    filteredWhisprs,
    typeOptions,
    isFiltered,
    resetFilters
  } = useWhisprFiltering({
    whisprs,
    initialViewMode: 'list'
  });

  // Use card navigation hook for swipe behavior in card view
  const {
    currentIndex,
    goToPrevCard,
    goToNextCard,
    swipeContainerRef,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    totalCount,
    hasPrevious,
    hasNext
  } = useCardNavigation({
    whisprs: filteredWhisprs
  });

  /**
   * Render the profile header
   */
  const renderHeader = () => (
    <div className="p-4 border-b border-background-highlight bg-background-card">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-primary flex items-center justify-center text-white">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <div className="font-semibold text-text-bright">{displayName}</div>
          <div className="text-xs text-text-muted flex items-center gap-1">
            {stats.unread > 0 ? (
              <>
                <Badge count={stats.unread} variant="accent" className="text-[10px] h-4 min-w-[16px]" />
                new whisprs
              </>
            ) : (
              'No new whisprs'
            )}
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Render card view with swipe navigation
   */
  const renderCardView = () => (
    <div className="h-full flex flex-col items-center justify-center">
      <div
        ref={swipeContainerRef}
        className="w-full transition-transform duration-300"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {filteredWhisprs.map((whispr, index) => (
          <div
            key={whispr.id}
            className={index === currentIndex ? 'block w-full' : 'hidden'}
          >
            <WhisprCard
              whispr={whispr}
              viewMode="card"
              onView={onView}
              onShare={onShare}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        {/* Card navigation arrows */}
        <button
          onClick={goToPrevCard}
          disabled={!hasPrevious}
          className={`p-2 rounded-full ${!hasPrevious ? 'text-text-muted' : 'text-text-bright'}`}
          aria-label="Previous card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center text-text-muted text-sm">
          {currentIndex + 1} of {totalCount}
        </div>

        <button
          onClick={goToNextCard}
          disabled={!hasNext}
          className={`p-2 rounded-full ${!hasNext ? 'text-text-muted' : 'text-text-bright'}`}
          aria-label="Next card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Swipe hint */}
      <div className="mt-2 text-xs text-text-muted text-center">
        Swipe left or right to navigate
      </div>
    </div>
  );

  /**
   * Render list view
   */
  const renderListView = () => (
    <div className="space-y-3">
      {filteredWhisprs.map((whispr) => (
        <WhisprCard
          key={whispr.id}
          whispr={whispr}
          viewMode="list"
          onView={onView}
          onShare={onShare}
          onDelete={onDelete}
        />
      ))}
    </div>
  );

  /**
   * Render empty state when no whisprs match filters
   */
  const renderEmptyState = () => (
    <EmptyState
      icon={searchTerm ? "🔍" : "📭"}
      title={searchTerm ? "No results found" : "No whisprs yet"}
      description={
        searchTerm
          ? `No whisprs match your search for "${searchTerm}"`
          : "Share your unique link with friends to start receiving anonymous whisprs"
      }
      action={
        isFiltered ? (
          <button
            onClick={resetFilters}
            className="px-3 py-1.5 bg-gradient-primary text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Clear filters
          </button>
        ) : (
          <button
            onClick={handleShareLink} 
            className="px-3 py-1.5 bg-gradient-primary text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {copied ? "Link Copied!" : "Share my link"}
          </button>
        )
      }
    />
  );

  return (
    <div className={`flex flex-col h-full bg-background-lighter ${className}`}>
      {renderHeader()}

      <FilterControls
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        sortOption={sortOption}
        setSortOption={setSortOption}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeOptions={typeOptions}
        isMobile={true}
      />

      <div className="flex-1 overflow-y-auto p-3 pb-20">
        {filteredWhisprs.length > 0 ? (
          viewMode === 'card' ? renderCardView() : renderListView()
        ) : (
          renderEmptyState()
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10">
        <MobileNavigationTabs unreadCount={stats.unread} />
      </div>
    </div>
  );
};

export default MobileWhisprView;
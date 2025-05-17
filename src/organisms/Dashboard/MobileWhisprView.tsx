import React, { useState, useEffect, useRef } from 'react';
import { ViewMode, Whispr, WhisprStats, WhisprType, SortOption } from '../../types/whispr';
import WhisprCard from '../../molecules/WhisprCard';
import EmptyState from '../../atoms/EmptyState';
import MobileNavigationTabs from '../../molecules/MobileNavigationTabs';
import Badge from '../../atoms/Badge';
import FilterControls from '../../molecules/FilterControl';

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
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedType, setSelectedType] = useState<WhisprType | 'all'>('all');
  const [sortOption, setSortOption] = useState<SortOption['value']>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredWhisprs, setFilteredWhisprs] = useState<Whispr[]>(whisprs);

  // For card swiping
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swiping, setSwiping] = useState(false);
  const [, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const swipeContainerRef = useRef<HTMLDivElement>(null);

  // Generate type options from stats - DIRECTLY FORCE THE CORRECT TOTAL
  const typeOptions = [
    { type: 'all' as const, count: whisprs.length },
    ...Object.entries(stats.byType).map(([type, count]) => ({
      type: type as WhisprType,
      count: count
    }))
  ];

  // Reset current card index when filtered whisprs change
  useEffect(() => {
    setCurrentCardIndex(0);
  }, [filteredWhisprs]);

  // Filter and sort whisprs
  useEffect(() => {
    let filtered = [...whisprs];

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(whispr => whispr.type === selectedType);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(whispr =>
        whispr.content.toLowerCase().includes(term)
      );
    }

    // Sort
    switch (sortOption) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'type':
        filtered.sort((a, b) => a.type.localeCompare(b.type));
        break;
      default:
        break;
    }

    setFilteredWhisprs(filtered);
  }, [whisprs, selectedType, sortOption, searchTerm]);

  // Calculate swipe distance
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setSwiping(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!swiping) return;
    setTouchEnd(e.targetTouches[0].clientX);

    // Calculate swipe direction and distance for animation
    if (touchStart !== null && touchEnd !== null) {
      const distance = touchEnd - touchStart;
      if (distance < 0) {
        setSwipeDirection('left');
      } else {
        setSwipeDirection('right');
      }

      // Apply transform during swipe
      if (swipeContainerRef.current) {
        const maxTranslate = 100; // Max pixels to translate
        const translate = Math.min(Math.abs(distance), maxTranslate) * (distance < 0 ? -1 : 1);
        swipeContainerRef.current.style.transform = `translateX(${translate}px)`;
        swipeContainerRef.current.style.opacity = `${1 - Math.abs(translate) / (maxTranslate * 2)}`;
      }
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !swiping) {
      // Reset swipe animation
      if (swipeContainerRef.current) {
        swipeContainerRef.current.style.transform = 'translateX(0)';
        swipeContainerRef.current.style.opacity = '1';
      }
      setSwiping(false);
      setSwipeDirection(null);
      return;
    }

    const distance = touchEnd - touchStart;
    const isLeftSwipe = distance < -minSwipeDistance;
    const isRightSwipe = distance > minSwipeDistance;

    // Reset swipe animation first
    if (swipeContainerRef.current) {
      swipeContainerRef.current.style.transform = 'translateX(0)';
      swipeContainerRef.current.style.opacity = '1';
    }

    if (isLeftSwipe && currentCardIndex < filteredWhisprs.length - 1) {
      // Go to next card
      setCurrentCardIndex(currentCardIndex + 1);
    } else if (isRightSwipe && currentCardIndex > 0) {
      // Go to previous card
      setCurrentCardIndex(currentCardIndex - 1);
    }

    setSwiping(false);
    setSwipeDirection(null);
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Handle manual navigation between cards
  const goToPrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const goToNextCard = () => {
    if (currentCardIndex < filteredWhisprs.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-background-lighter ${className}`}>
      {/* Header */}
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

      {/* Filter Section */}
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

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-3 pb-20">
        {filteredWhisprs.length > 0 ? (
          viewMode === 'card' ? (
            // Card View with swipe functionality
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
                    className={index === currentCardIndex ? 'block w-full' : 'hidden'}
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
                  disabled={currentCardIndex === 0}
                  className={`p-2 rounded-full ${currentCardIndex === 0 ? 'text-text-muted' : 'text-text-bright'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="text-center text-text-muted text-sm">
                  {currentCardIndex + 1} of {filteredWhisprs.length}
                </div>

                <button
                  onClick={goToNextCard}
                  disabled={currentCardIndex === filteredWhisprs.length - 1}
                  className={`p-2 rounded-full ${currentCardIndex === filteredWhisprs.length - 1 ? 'text-text-muted' : 'text-text-bright'}`}
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
          ) : (
            // List View
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
          )
        ) : (
          <EmptyState
            icon={searchTerm ? "🔍" : "📭"}
            title={searchTerm ? "No results found" : "No whisprs yet"}
            description={
              searchTerm
                ? `No whisprs match your search for "${searchTerm}"`
                : "Share your unique link with friends to start receiving anonymous whisprs"
            }
            action={
              searchTerm ? (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-3 py-1.5 bg-gradient-primary text-white rounded-lg text-sm"
                >
                  Clear search
                </button>
              ) : (
                <button className="px-3 py-1.5 bg-gradient-primary text-white rounded-lg text-sm">
                  Share my link
                </button>
              )
            }
          />
        )}
      </div>

      {/* Fixed Navigation Tabs */}
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <MobileNavigationTabs unreadCount={stats.unread} />
      </div>
    </div>
  );
};

export default MobileWhisprView;
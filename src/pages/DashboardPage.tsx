import React from 'react';
import DashboardTemplate from '../templates/DashboardTemplate';
import DashboardHeader from '../molecules/DashboardHeader';
import { useAuth } from '../context/auth';
import MobileWhisprView from '../organisms/Dashboard/MobileWhisprView';
import WhisprList from '../organisms/Dashboard/WhisprList';
import WhisprSwipeCard from '../molecules/WhisprSwipeCard';
import FilterControls from '../molecules/FilterControl';
import ViewWhisprModal from '../molecules/ViewWhisprModal';

// Import custom hooks
import { useWhisprs } from '../hooks/useWhisprs';
import { useWhisprFiltering } from '../hooks/useWhisprFiltering';
import { useResponsive } from '../hooks/useResponsive';
import { useWhisprModal } from '../hooks/useWhisprModal';
import { APP_URL_CLEAN } from '../configs';
import { Whispr } from '../types/whispr';

const DashboardPage: React.FC = () => {
  // Authentication context
  const { user, profile } = useAuth();
  
  // Profile information
  const displayName = profile?.display_name || user?.user_metadata?.username || 'User';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || '';
  const username = profile?.username || user?.user_metadata?.username || 'user';
  const profileUrl = `${APP_URL_CLEAN}/${username}`;

  const { whisprs, isLoading, stats, markAsRead, deleteWhispr } = useWhisprs({
    user,
    username,
  });

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
    totalCount,
    resetFilters,
    isFiltered
  } = useWhisprFiltering({ 
    whisprs,
    initialViewMode: 'grid' 
  });
  
  const { isMobile } = useResponsive();
  const { isOpen: viewModalOpen, selectedItem: selectedWhispr, openModal, closeModal } = useWhisprModal();

  // Event handlers
  const handleView = (whispr: Whispr) => {
    if (!whispr.isRead) {
      markAsRead(whispr.id);
    }
    openModal(whispr);
  };

  const handleShare = (whispr: Whispr) => {
    if (!whispr.isRead) {
      markAsRead(whispr.id);
    }
    openModal(whispr);
  };

  const handleDelete = async (whisprId: string) => {
    await deleteWhispr(whisprId);
  };

  /**
   * Render the view modal that is common between mobile/desktop views
   */
  const renderViewModal = () => (
    selectedWhispr && (
      <ViewWhisprModal
        whispr={selectedWhispr}
        isOpen={viewModalOpen}
        onClose={closeModal}
        username={username}
        profileUrl={profileUrl}
      />
    )
  );

  // Mobile view
  if (isMobile) {
    return (
      <>
        <div className="md:hidden h-screen">
          <MobileWhisprView
            whisprs={whisprs}
            stats={stats}
            displayName={displayName}
            avatarUrl={avatarUrl}
            onView={handleView}
            onShare={handleShare}
            onDelete={handleDelete}
          />
        </div>

        {renderViewModal()}
      </>
    );
  }

  // Desktop view
  return (
    <>
      <DashboardTemplate unreadCount={stats.unread}>
        <div className="flex flex-col h-full">
          <DashboardHeader
            displayName={displayName}
            unreadCount={stats.unread}
            avatarUrl={avatarUrl}
          />
          
          <div className="sticky top-0 pt-2 z-10 bg-white/1 backdrop-blur-sm transition-all">
            <div className="mb-4">
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
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {viewMode === 'card' ? (
              <WhisprSwipeCard
                whisprs={filteredWhisprs}
                onView={handleView}
                onShare={handleShare}
                onDelete={handleDelete}
              />
            ) : (
              <WhisprList
                whisprs={filteredWhisprs}
                viewMode={viewMode}
                onView={handleView}
                onShare={handleShare}
                onDelete={handleDelete}
                isLoading={isLoading}
                searchTerm={searchTerm}
                totalWhisprs={totalCount}
                resetFilters={resetFilters}
                isFiltered={isFiltered}
              />
            )}
          </div>
        </div>
      </DashboardTemplate>

      {renderViewModal()}
    </>
  );
};

export default DashboardPage;
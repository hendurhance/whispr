'use client';

import React, { useState } from 'react';
import DashboardTemplate from '@/components/templates/DashboardTemplate';
import DashboardHeader from '@/components/molecules/DashboardHeader';
import MobileWhisprView from '@/components/organisms/Dashboard/MobileWhisprView';
import WhisprList from '@/components/organisms/Dashboard/WhisprList';
import WhisprSwipeCard from '@/components/molecules/WhisprSwipeCard';
import FilterControls from '@/components/molecules/FilterControl';
import ViewWhisprModal from '@/components/molecules/ViewWhisprModal';
import { toast } from 'react-hot-toast';
import { createClient } from '@/utils/supabase/client';

// Import custom hooks
import { useWhisprFiltering } from '@/hooks/useWhisprFiltering';
import { useResponsive } from '@/hooks/useResponsive';
import { useWhisprModal } from '@/hooks/useWhisprModal';
import { APP_URL_CLEAN } from '@/configs';
import { Whispr, WhisprType, WhisprStats } from '@/types/whispr';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types';

interface DashboardPageProps {
  initialWhisprs: Array<{
    id: string;
    content: string;
    type: string;
    created_at: string;
    is_read: boolean;
    metadata?: Record<string, unknown>;
  }>;
  initialUser: User;
  initialProfile: Profile | null;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ initialWhisprs, initialUser, initialProfile }) => {
  const supabase = createClient();
  
  // Transform initial whisprs
  const username = initialProfile?.username || initialUser?.user_metadata?.username || 'user';
  const transformedInitialWhisprs: Whispr[] = initialWhisprs.map(whispr => ({
    id: whispr.id,
    content: whispr.content,
    type: whispr.type as WhisprType,
    createdAt: whispr.created_at,
    isRead: whispr.is_read,
    metadata: whispr.metadata || {},
    username
  }));
  
  // Local state for whisprs
  const [whisprs, setWhisprs] = useState<Whispr[]>(transformedInitialWhisprs);
  
  // Profile information
  const displayName = initialProfile?.display_name || initialUser?.user_metadata?.username || 'User';
  const avatarUrl = initialProfile?.avatar_url || initialUser?.user_metadata?.avatar_url || '';
  const profileUrl = `${APP_URL_CLEAN}/${username}`;
  
  // Calculate stats
  const calculateStats = (): WhisprStats => {
    const byType = whisprs.reduce((acc, whispr) => {
      acc[whispr.type] = (acc[whispr.type] || 0) + 1;
      return acc;
    }, {} as Record<WhisprType, number>);

    return {
      total: whisprs.length,
      unread: whisprs.filter(w => !w.isRead).length,
      byType
    };
  };
  
  const stats = calculateStats();
  
  // Mark whispr as read
  const markAsRead = async (whisprId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .rpc('mark_whispr_read', {
          whispr_id: whisprId,
        });

      if (error) {
        console.error('Error marking whispr as read:', error);
        return false;
      }

      if (data) {
        // Update local state
        setWhisprs(whisprs.map(w =>
          w.id === whisprId ? { ...w, isRead: true } : w
        ));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error in markAsRead:', error);
      return false;
    }
  };
  
  // Delete whispr
  const deleteWhispr = async (whisprId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .rpc('delete_whispr', { whispr_id: whisprId });

      if (error) {
        console.error('Error deleting whispr:', error);
        toast.error('Failed to delete whispr');
        return false;
      }

      // Update local state
      setWhisprs(whisprs.filter(w => w.id !== whisprId));
      toast.success('Whispr deleted successfully');
      return true;
    } catch (error) {
      console.error('Error in deleteWhispr:', error);
      toast.error('Something went wrong');
      return false;
    }
  };

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
            username={username}
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
            username={username}
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
                username={username}
                onView={handleView}
                onShare={handleShare}
                onDelete={handleDelete}
              />
            ) : (
              <WhisprList
                whisprs={filteredWhisprs}
                viewMode={viewMode}
                username={username}
                onView={handleView}
                onShare={handleShare}
                onDelete={handleDelete}
                isLoading={false}
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
'use client';

import React, { useState, useMemo } from 'react';
import DashboardTemplate from '@/components/templates/DashboardTemplate';
import DashboardHeader from '@/components/molecules/DashboardHeader';
import MobileWhisprView from '@/components/organisms/Dashboard/MobileWhisprView';
import WhisprList from '@/components/organisms/Dashboard/WhisprList';
import WhisprSwipeCard from '@/components/molecules/WhisprSwipeCard';
import FilterControls from '@/components/molecules/FilterControl';
import ViewWhisprModal from '@/components/molecules/ViewWhisprModal';
import { toast } from 'react-hot-toast';
import { markWhisprAsRead, deleteWhisprById } from '@/lib/client/whisprs';

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

  const [whisprs, setWhisprs] = useState<Whispr[]>(transformedInitialWhisprs);

  const displayName = initialProfile?.display_name || initialUser?.user_metadata?.username || 'User';
  const avatarUrl = initialProfile?.avatar_url || initialUser?.user_metadata?.avatar_url || '';
  const profileUrl = `${APP_URL_CLEAN}/${username}`;

  const stats = useMemo((): WhisprStats => {
    const byType = whisprs.reduce((acc, whispr) => {
      acc[whispr.type] = (acc[whispr.type] || 0) + 1;
      return acc;
    }, {} as Record<WhisprType, number>);

    return {
      total: whisprs.length,
      unread: whisprs.filter(w => !w.isRead).length,
      byType
    };
  }, [whisprs]);

  const markAsRead = async (whisprId: string): Promise<boolean> => {
    const success = await markWhisprAsRead(whisprId);
    if (success) {
      setWhisprs(prev => prev.map(w =>
        w.id === whisprId ? { ...w, isRead: true } : w
      ));
    }
    return success;
  };

  const deleteWhispr = async (whisprId: string): Promise<boolean> => {
    const success = await deleteWhisprById(whisprId);
    if (success) {
      setWhisprs(prev => prev.filter(w => w.id !== whisprId));
      toast.success('Whispr deleted successfully');
    }
    return success;
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

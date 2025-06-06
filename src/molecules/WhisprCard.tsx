import React from 'react';
import { Whispr, formatDate, getWhisprTypeIcon } from '../types/whispr';
import TypeBadge from '../atoms/TypeBadge';
import GenericModal from '../atoms/GenericModal';
import { useWhisprCard } from '../hooks/useWhisprCard';

interface WhisprCardProps {
  whispr: Whispr;
  viewMode: 'grid' | 'list' | 'card';
  onView?: (whispr: Whispr) => void;
  onShare?: (whispr: Whispr) => void;
  onDelete?: (whisprId: string) => void;
  className?: string;
  forShowcase?: boolean;
}

/**
 * WhisprCard component that renders a whispr in different view modes
 */
const WhisprCard: React.FC<WhisprCardProps> = ({
  whispr,
  viewMode,
  onView,
  onShare,
  onDelete,
  className = '',
  forShowcase = false
}) => {
  const {
    showDeleteModal,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteConfirm,
    getBorderClass
  } = useWhisprCard({ whispr, onDelete });

  /**
   * Delete confirmation modal
   */
  const DeleteConfirmationModal = () => (
    <GenericModal
      title="Delete Whispr"
      titleColor="text-accent-pink"
      onCancel={closeDeleteModal}
      onConfirm={handleDeleteConfirm}
      confirmText="Delete"
      confirmButtonClass="bg-accent-pink hover:bg-accent-pink/80"
      isConfirmLoading={isDeleting}
    >
      <p className="text-text-normal">
        Are you sure you want to delete this whispr? This action cannot be undone.
      </p>
    </GenericModal>
  );

  /**
   * Content header with type badge and date
   */
  const ContentHeader = ({ className = '' }: { className?: string }) => (
    <div className={`flex items-center justify-between ${className}`}>
      <TypeBadge type={whispr.type} />
      <span className="text-xs text-text-muted">
        {formatDate(whispr.createdAt, forShowcase)}
      </span>
    </div>
  );

  /**
   * Action buttons for view, share, delete
   */
  const ActionButtons = ({ variant }: { variant: 'list' | 'grid' | 'card' }) => {
    const baseButtonStyles = {
      view: 'bg-accent-purple/10 text-accent-purple hover:bg-accent-purple/20',
      share: 'bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20',
      delete: 'bg-accent-pink/10 text-accent-pink hover:bg-accent-pink/20'
    };

    // Style variants for different view modes
    const buttonStyles = {
      list: {
        container: 'flex gap-2',
        view: `text-xs px-3 py-1 rounded-full ${baseButtonStyles.view} transition-colors`,
        share: `text-xs px-3 py-1 rounded-full ${baseButtonStyles.share} transition-colors`,
        delete: `text-xs px-3 py-1 rounded-full ${baseButtonStyles.delete} transition-colors ml-auto`
      },
      grid: {
        container: 'flex gap-2 mt-auto',
        view: `flex-1 text-xs px-3 py-1 rounded-full ${baseButtonStyles.view} transition-colors`,
        share: `flex-1 text-xs px-3 py-1 rounded-full ${baseButtonStyles.share} transition-colors`,
        delete: `text-xs px-2 py-1 rounded-full ${baseButtonStyles.delete} transition-colors`
      },
      card: {
        container: 'flex gap-3 mt-auto',
        view: `flex-1 py-2 rounded-lg ${baseButtonStyles.view} transition-colors`,
        share: `flex-1 py-2 rounded-lg ${baseButtonStyles.share} transition-colors`,
        delete: `py-2 px-3 rounded-lg ${baseButtonStyles.delete} transition-colors`
      }
    };

    const style = buttonStyles[variant];
    const deleteLabel = variant === 'grid' ? '×' : 'Delete';

    return (
      <div className={style.container}>
        {onView && (
          <button
            onClick={() => onView(whispr)}
            className={style.view}
            aria-label="View whispr"
          >
            View
          </button>
        )}

        {onShare && (
          <button
            onClick={() => onShare(whispr)}
            className={style.share}
            aria-label="Share whispr"
          >
            Share
          </button>
        )}

        {onDelete && (
          <button
            onClick={openDeleteModal}
            className={style.delete}
            aria-label="Delete whispr"
          >
            {deleteLabel}
          </button>
        )}
      </div>
    );
  };

  /**
   * List view layout
   */
  const ListViewLayout = () => (
    <div className={`p-4 bg-background-card rounded-xl border ${getBorderClass()} transition-all hover:shadow-sm ${className}`}>
      <div className="flex items-start gap-3">
        {!forShowcase && (
          <div className="bg-background-darkest rounded-lg p-2 text-xl">
            {getWhisprTypeIcon(whispr.type)}
          </div>
        )}
        <div className="flex-1">
          <ContentHeader className="mb-1" />
          <p className="text-text-bright mb-3">{whispr.content}</p>
          <ActionButtons variant="list" />
        </div>
      </div>
    </div>
  );

  /**
   * Grid view layout
   */
  const GridViewLayout = () => (
    <div className={`p-4 bg-background-card rounded-xl border ${getBorderClass()} h-full flex flex-col transition-all hover:shadow-sm ${className}`}>
      <ContentHeader className="mb-3" />
      <p className="text-text-bright mb-4 flex-1">{whispr.content}</p>
      <ActionButtons variant="grid" />
    </div>
  );

  /**
   * Card view layout (swipe card)
   */
  const CardViewLayout = () => (
    <div className={`p-6 bg-background-card rounded-xl border ${getBorderClass()} flex flex-col shadow-md max-w-md mx-auto transition-all ${className}`}>
      <ContentHeader className="mb-4" />
      <p className="text-text-bright text-lg mb-6 flex-1">{whispr.content}</p>
      <ActionButtons variant="card" />
    </div>
  );

  // Render the appropriate layout based on view mode
  return (
    <>
      {viewMode === 'list' && <ListViewLayout />}
      {viewMode === 'grid' && <GridViewLayout />}
      {viewMode === 'card' && <CardViewLayout />}

      {/* Delete Confirmation Modal (common for all layouts) */}
      {showDeleteModal && <DeleteConfirmationModal />}
    </>
  );
};

export default WhisprCard;
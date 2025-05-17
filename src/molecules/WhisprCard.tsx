import React, { useState } from 'react';
import { Whispr, formatDate, getWhisprTypeIcon } from '../types/whispr';
import TypeBadge from '../atoms/TypeBadge';
import GenericModal from '../atoms/GenericModal';

interface WhisprCardProps {
  whispr: Whispr;
  viewMode: 'grid' | 'list' | 'card';
  onView?: (whispr: Whispr) => void;
  onShare?: (whispr: Whispr) => void;
  onDelete?: (whisprId: string) => void;
  className?: string;
  forShowcase?: boolean;
}

const WhisprCard: React.FC<WhisprCardProps> = ({ 
  whispr, 
  viewMode,
  onView,
  onShare,
  onDelete,
  className = '',
  forShowcase = false
}) => {
  // Add state for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to handle delete confirmation
  const handleDeleteConfirm = () => {
    if (onDelete) {
      setIsDeleting(true);
      // Call the onDelete function and close the modal
      onDelete(whispr.id);
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Different layout based on view mode
  if (viewMode === 'list') {
    return (
      <>
        <div className={`p-4 bg-background-card rounded-xl border ${whispr.isRead ? 'border-overlay-light' : 'border-primary'} transition-all hover:shadow-sm ${className}`}>
          <div className="flex items-start gap-3">
              {!forShowcase && (
              <div className="bg-background-darkest rounded-lg p-2 text-xl">
                {getWhisprTypeIcon(whispr.type)}
              </div>
              )}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <TypeBadge type={whispr.type} />
                <span className="text-xs text-text-muted">{formatDate(whispr.createdAt, forShowcase)}</span>
              </div>
              <p className="text-text-bright mb-3">{whispr.content}</p>
              <div className="flex gap-2">
                {onView && (
                  <button 
                    onClick={() => onView(whispr)}
                    className="text-xs px-3 py-1 rounded-full bg-accent-purple/10 text-accent-purple hover:bg-accent-purple/20 transition-colors"
                  >
                    View
                  </button>
                )}
                {onShare && (
                  <button 
                    onClick={() => onShare(whispr)}
                    className="text-xs px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 transition-colors"
                  >
                    Share
                  </button>
                )}
                {onDelete && (
                  <button 
                    onClick={() => setShowDeleteModal(true)} // Open delete modal instead of direct delete
                    className="text-xs px-3 py-1 rounded-full bg-accent-pink/10 text-accent-pink hover:bg-accent-pink/20 transition-colors ml-auto"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <GenericModal
            title="Delete Whispr"
            titleColor="text-accent-pink"
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteConfirm}
            confirmText="Delete"
            confirmButtonClass="bg-accent-pink hover:bg-accent-pink-light"
            isConfirmLoading={isDeleting}
          >
            <p className="text-text-normal">
              Are you sure you want to delete this whispr? This action cannot be undone.
            </p>
          </GenericModal>
        )}
      </>
    );
  }
  
  if (viewMode === 'grid') {
    return (
      <>
        <div className={`p-4 bg-background-card rounded-xl border ${whispr.isRead ? 'border-overlay-light' : 'border-primary'} h-full flex flex-col transition-all hover:shadow-sm ${className}`}>
          <div className="flex items-center justify-between mb-3">
            <TypeBadge type={whispr.type} />
            <span className="text-xs text-text-muted">{formatDate(whispr.createdAt)}</span>
          </div>
          <p className="text-text-bright mb-4 flex-1">{whispr.content}</p>
          <div className="flex gap-2 mt-auto">
            {onView && (
              <button 
                onClick={() => onView(whispr)}
                className="flex-1 text-xs px-3 py-1 rounded-full bg-accent-purple/10 text-accent-purple hover:bg-accent-purple/20 transition-colors"
              >
                View
              </button>
            )}
            {onShare && (
              <button 
                onClick={() => onShare(whispr)}
                className="flex-1 text-xs px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 transition-colors"
              >
                Share
              </button>
            )}
            {onDelete && (
              <button 
                onClick={() => setShowDeleteModal(true)} // Open delete modal instead of direct delete
                className="text-xs px-2 py-1 rounded-full bg-accent-pink/10 text-accent-pink hover:bg-accent-pink/20 transition-colors"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <GenericModal
            title="Delete Whispr"
            titleColor="text-accent-pink"
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteConfirm}
            confirmText="Delete"
            confirmButtonClass="bg-accent-pink hover:bg-accent-pink-light"
            isConfirmLoading={isDeleting}
          >
            <p className="text-text-normal">
              Are you sure you want to delete this whispr? This action cannot be undone.
            </p>
          </GenericModal>
        )}
      </>
    );
  }
  
  // Card view (swipe card)
  return (
    <>
      <div className={`p-6 bg-background-card rounded-xl border ${whispr.isRead ? 'border-overlay-light' : 'border-primary'} flex flex-col shadow-md max-w-md mx-auto transition-all ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <TypeBadge type={whispr.type} />
          <span className="text-xs text-text-muted">{formatDate(whispr.createdAt)}</span>
        </div>
        <p className="text-text-bright text-lg mb-6 flex-1">{whispr.content}</p>
        <div className="flex gap-3 mt-auto">
          {onView && (
            <button 
              onClick={() => onView(whispr)}
              className="flex-1 py-2 rounded-lg bg-accent-purple/10 text-accent-purple hover:bg-accent-purple/20 transition-colors"
            >
              View
            </button>
          )}
          {onShare && (
            <button 
              onClick={() => onShare(whispr)}
              className="flex-1 py-2 rounded-lg bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 transition-colors"
            >
              Share
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => setShowDeleteModal(true)} // Open delete modal instead of direct delete
              className="py-2 px-3 rounded-lg bg-accent-pink/10 text-accent-pink hover:bg-accent-pink/20 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <GenericModal
          title="Delete Whispr"
          titleColor="text-accent-pink"
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          confirmText="Delete"
          confirmButtonClass="bg-accent-pink hover:bg-accent-pink-light"
          isConfirmLoading={isDeleting}
        >
          <p className="text-text-normal">
            Are you sure you want to delete this whispr? This action cannot be undone.
          </p>
        </GenericModal>
      )}
    </>
  );
};

export default WhisprCard;
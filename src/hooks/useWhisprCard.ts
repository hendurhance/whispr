import { useState, useCallback } from 'react';
import { Whispr } from '../types/whispr';

interface UseWhisprCardProps {
  whispr: Whispr;
  onDelete?: (whisprId: string) => void;
}

export const useWhisprCard = ({ whispr, onDelete }: UseWhisprCardProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Opens the delete confirmation modal
   */
  const openDeleteModal = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  /**
   * Closes the delete confirmation modal
   */
  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  /**
   * Handles delete confirmation and executes delete action
   */
  const handleDeleteConfirm = useCallback(async () => {
    if (!onDelete) return;
    
    try {
      setIsDeleting(true);
      await onDelete(whispr.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  }, [whispr.id, onDelete]);

  /**
   * Get border color based on read status
   */
  const getBorderClass = useCallback(() => {
    return whispr.isRead ? 'border-overlay-light' : 'border-primary';
  }, [whispr.isRead]);

  return {
    showDeleteModal,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteConfirm,
    getBorderClass
  };
};
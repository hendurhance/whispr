import { useState, useCallback } from 'react';
import { Whispr } from '@/types/whispr';

interface UseWhisprCardProps {
  whispr: Whispr;
  onDelete?: (whisprId: string) => void;
}

export const useWhisprCard = ({ whispr, onDelete }: UseWhisprCardProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteModal = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

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
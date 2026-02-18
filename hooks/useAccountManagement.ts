import { useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

interface UseAccountManagementProps {
  onSignOutEverywhere: () => void;
  onDeleteAccount: () => void;
}

export const useAccountManagement = ({ 
  onSignOutEverywhere, 
  onDeleteAccount 
}: UseAccountManagementProps) => {
  const supabase = createClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  const openDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);
  
  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);
  
  const confirmDelete = useCallback(() => {
    onDeleteAccount();
    // Modal will be closed after the delete operation completes
  }, [onDeleteAccount]);
  
  const openSignOutModal = useCallback(() => {
    setIsSignOutModalOpen(true);
  }, []);
  
  const closeSignOutModal = useCallback(() => {
    setIsSignOutModalOpen(false);
  }, []);
  
  const confirmSignOut = useCallback(async () => {
    setIsSigningOut(true);
    
    try {
      await supabase.auth.signOut({ scope: 'global' });
      onSignOutEverywhere();
      closeSignOutModal();
    } catch (error) {
      console.error('Error signing out from all devices:', error);
      // Return error to let component decide how to display it
      return new Error('Failed to sign out from all devices');
    } finally {
      setIsSigningOut(false);
    }
    
    return null;
  }, [onSignOutEverywhere, closeSignOutModal]);
  
  return {
    isDeleteModalOpen,
    isSignOutModalOpen,
    isSigningOut,

    openDeleteModal,
    closeDeleteModal,
    confirmDelete,

    openSignOutModal,
    closeSignOutModal,
    confirmSignOut
  };
};
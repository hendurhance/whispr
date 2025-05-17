import { useState, useCallback } from 'react';
import supabase from '../lib/supabase';

interface UseAccountManagementProps {
  onSignOutEverywhere: () => void;
  onDeleteAccount: () => void;
}

export const useAccountManagement = ({ 
  onSignOutEverywhere, 
  onDeleteAccount 
}: UseAccountManagementProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  // Delete account handlers
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
  
  // Sign out everywhere handlers
  const openSignOutModal = useCallback(() => {
    setIsSignOutModalOpen(true);
  }, []);
  
  const closeSignOutModal = useCallback(() => {
    setIsSignOutModalOpen(false);
  }, []);
  
  const confirmSignOut = useCallback(async () => {
    setIsSigningOut(true);
    
    try {
      // Sign out from all devices using the global scope
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
    // Modal states
    isDeleteModalOpen,
    isSignOutModalOpen,
    isSigningOut,
    
    // Delete account methods
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    
    // Sign out methods
    openSignOutModal,
    closeSignOutModal,
    confirmSignOut
  };
};
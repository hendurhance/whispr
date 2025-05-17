import { useState, useCallback } from 'react';
import supabase from '../lib/supabase';

interface UseEmailSettingsProps {
  userId?: string;
  enableNotifications: boolean;
  onToggleNotifications: () => void;
}

export const useEmailSettings = ({
  userId,
  enableNotifications,
  onToggleNotifications
}: UseEmailSettingsProps) => {
  // Modal state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  
  // Email notification states
  const [isUpdatingNotification, setIsUpdatingNotification] = useState(false);
  const [notificationState, setNotificationState] = useState(enableNotifications);
  
  // Error handling
  const [error, setError] = useState<string | null>(null);

  // Update notificationState when prop changes (helps with parent component updates)
  if (enableNotifications !== notificationState && !isUpdatingNotification) {
    setNotificationState(enableNotifications);
  }

  // Email modal handlers
  const openEmailModal = useCallback(() => {
    setIsEmailModalOpen(true);
  }, []);

  const closeEmailModal = useCallback(() => {
    setIsEmailModalOpen(false);
  }, []);

  // Toggle email notifications
  const toggleNotifications = useCallback(async () => {
    if (!userId) {
      setError('User ID is required to update notification preferences');
      setTimeout(() => setError(null), 5000);
      return;
    }
    
    setIsUpdatingNotification(true);
    setError(null);
    
    try {
      // Toggle the notification state locally first for immediate feedback
      const newState = !notificationState;
      setNotificationState(newState);
      
      // Update the notification preference in the profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          email_notifications: newState,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
        
      if (updateError) throw updateError;
      
      // Call the parent handler to sync state upstream
      onToggleNotifications();
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || 'Failed to update notification preferences';
      console.error('Error updating notification preferences:', errorMessage);
      // Revert state if update fails
      setNotificationState(notificationState);
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsUpdatingNotification(false);
    }
  }, [userId, notificationState, onToggleNotifications]);

  return {
    // States
    isEmailModalOpen,
    isUpdatingNotification,
    notificationState,
    error,
    
    // Actions
    openEmailModal,
    closeEmailModal,
    toggleNotifications
  };
};
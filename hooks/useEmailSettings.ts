import { useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

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
  const supabase = createClient();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const [isUpdatingNotification, setIsUpdatingNotification] = useState(false);
  // Track optimistic override; null means "use the prop value"
  const [optimisticOverride, setOptimisticOverride] = useState<boolean | null>(null);

  const notificationState = optimisticOverride ?? enableNotifications;

  const [error, setError] = useState<string | null>(null);

  const openEmailModal = useCallback(() => {
    setIsEmailModalOpen(true);
  }, []);

  const closeEmailModal = useCallback(() => {
    setIsEmailModalOpen(false);
  }, []);

  const toggleNotifications = useCallback(async () => {
    if (!userId) {
      setError('User ID is required to update notification preferences');
      setTimeout(() => setError(null), 5000);
      return;
    }

    setIsUpdatingNotification(true);
    setError(null);

    try {
      const newState = !notificationState;
      setOptimisticOverride(newState);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          email_notifications: newState,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      onToggleNotifications();
      // Clear override so we follow the prop again
      setOptimisticOverride(null);
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || 'Failed to update notification preferences';
      console.error('Error updating notification preferences:', errorMessage);
      setOptimisticOverride(null);
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsUpdatingNotification(false);
    }
  }, [userId, notificationState, onToggleNotifications]);

  return {
    isEmailModalOpen,
    isUpdatingNotification,
    notificationState,
    error,

    openEmailModal,
    closeEmailModal,
    toggleNotifications
  };
};

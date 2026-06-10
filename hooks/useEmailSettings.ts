import { useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

interface UseEmailSettingsProps {
  userId?: string;
  enableNotifications: boolean;
  onToggleNotifications: () => void;
}

export const useEmailSettings = ({ userId, enableNotifications, onToggleNotifications }: UseEmailSettingsProps) => {
  const supabase = createClient();
  const [isUpdatingNotification, setIsUpdatingNotification] = useState(false);
  const [optimisticOverride, setOptimisticOverride] = useState<boolean | null>(null);
  const notificationState = optimisticOverride ?? enableNotifications;

  const toggleNotifications = useCallback(async () => {
    if (!userId) return;

    const next = !notificationState;
    setIsUpdatingNotification(true);
    setOptimisticOverride(next);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ email_notifications: next, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
      if (error) throw error;
      onToggleNotifications();
    } catch (error) {
      console.error('Failed to update notification preference:', error);
    } finally {
      setOptimisticOverride(null);
      setIsUpdatingNotification(false);
    }
  }, [userId, notificationState, onToggleNotifications, supabase]);

  return { notificationState, isUpdatingNotification, toggleNotifications };
};

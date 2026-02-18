import { createClient } from '@/utils/supabase/client';
import { toast } from 'react-hot-toast';
import CONFIGURATIONS from '@/configs';
import { isValidWhisprType } from '@/utils/validation';

/**
 * Mark a whispr as read via RPC.
 * Returns true if the whispr was successfully marked.
 */
export const markWhisprAsRead = async (whisprId: string): Promise<boolean> => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .rpc('mark_whispr_read', { whispr_id: whisprId });

    if (error) {
      console.error('Error marking whispr as read:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in markWhisprAsRead:', error);
    return false;
  }
};

/**
 * Delete a whispr via RPC.
 * Returns true on success. Shows a toast on error.
 */
export const deleteWhisprById = async (whisprId: string): Promise<boolean> => {
  const supabase = createClient();
  try {
    const { error } = await supabase
      .rpc('delete_whispr', { whispr_id: whisprId });

    if (error) {
      console.error('Error deleting whispr:', error);
      toast.error('Failed to delete whispr');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteWhispr:', error);
    toast.error('Something went wrong');
    return false;
  }
};

/**
 * Submit an anonymous whispr via edge function.
 */
export const submitWhispr = async (username: string, content: string, type: string) => {
  if (!isValidWhisprType(type)) {
    throw new Error(`Invalid whispr type: ${type}`);
  }

  const response = await fetch(CONFIGURATIONS.FUNCTIONS.SUBMIT_WHISPR, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, content, type })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to submit whispr');
  }

  return data;
};

/**
 * Update the whispr count for a profile via edge function.
 * Returns the new count, or null on failure.
 */
export const updateWhisprCount = async (username: string): Promise<number | null> => {
  try {
    const response = await fetch(CONFIGURATIONS.FUNCTIONS.UPDATE_WHISPR_COUNTS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });

    const data = await response.json();

    if (!response.ok) {
      return null;
    }

    return data.whisprs;
  } catch (error) {
    console.error('Error updating whispr count:', error);
    return null;
  }
};

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import supabase from '../lib/supabase';
import { Whispr, WhisprType, WhisprStats } from '../types/whispr';
import { User } from '@supabase/supabase-js';

interface UseWhisprsProps {
  user: User | null;
  username: string;
}

export const useWhisprs = ({ user, username }: UseWhisprsProps) => {
  const [whisprs, setWhisprs] = useState<Whispr[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch whisprs from Supabase
  useEffect(() => {
    const fetchWhisprs = async () => {
      setIsLoading(true);
      
      try {
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('whisprs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching whisprs:', error);
          toast.error('Failed to load whisprs');
          return;
        }

        // Transform the data to match our Whispr interface
        const transformedData: Whispr[] = data.map(whispr => ({
          id: whispr.id,
          content: whispr.content,
          type: whispr.type as WhisprType,
          createdAt: whispr.created_at,
          isRead: whispr.is_read,
          metadata: whispr.metadata || {},
          username: username || 'user'
        }));

        setWhisprs(transformedData);
      } catch (error) {
        console.error('Error in fetchWhisprs:', error);
        toast.error('Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.user_metadata?.profile_setup) {
      fetchWhisprs();
    } else {
      setIsLoading(false);
    }
  }, [user, username]);

  // Calculate stats for whisprs
  const calculateStats = (): WhisprStats => {
    const byType = whisprs.reduce((acc, whispr) => {
      acc[whispr.type] = (acc[whispr.type] || 0) + 1;
      return acc;
    }, {} as Record<WhisprType, number>);

    return {
      total: whisprs.length,
      unread: whisprs.filter(w => !w.isRead).length,
      byType
    };
  };

  // Mark whispr as read
  const markAsRead = async (whisprId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .rpc('mark_whispr_read', {
          whispr_id: whisprId,
        });

      if (error) {
        console.error('Error marking whispr as read:', error);
        return false;
      }

      if (data) {
        // Update local state
        setWhisprs(whisprs.map(w =>
          w.id === whisprId ? { ...w, isRead: true } : w
        ));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error in markAsRead:', error);
      return false;
    }
  };

  // Delete whispr
  const deleteWhispr = async (whisprId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .rpc('delete_whispr', { whispr_id: whisprId });

      if (error) {
        console.error('Error deleting whispr:', error);
        toast.error('Failed to delete whispr');
        return false;
      }

      // Update local state
      setWhisprs(whisprs.filter(w => w.id !== whisprId));
      toast.success('Whispr deleted successfully');
      return true;
    } catch (error) {
      console.error('Error in deleteWhispr:', error);
      toast.error('Something went wrong');
      return false;
    }
  };

  return {
    whisprs,
    isLoading,
    stats: calculateStats(),
    markAsRead,
    deleteWhispr
  };
};

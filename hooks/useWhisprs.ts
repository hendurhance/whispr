import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { createClient } from '@/utils/supabase/client';
import { markWhisprAsRead, deleteWhisprById } from '@/lib/client/whisprs';
import { Whispr, WhisprType, WhisprStats } from '@/types/whispr';
import { User } from '@supabase/supabase-js';

interface UseWhisprsProps {
  user: User | null;
  username: string;
}

export const useWhisprs = ({ user, username }: UseWhisprsProps) => {
  const [whisprs, setWhisprs] = useState<Whispr[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

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

  const stats = useMemo((): WhisprStats => {
    const byType = whisprs.reduce((acc, whispr) => {
      acc[whispr.type] = (acc[whispr.type] || 0) + 1;
      return acc;
    }, {} as Record<WhisprType, number>);

    return {
      total: whisprs.length,
      unread: whisprs.filter(w => !w.isRead).length,
      byType
    };
  }, [whisprs]);

  const markAsRead = async (whisprId: string): Promise<boolean> => {
    const success = await markWhisprAsRead(whisprId);
    if (success) {
      setWhisprs(prev => prev.map(w =>
        w.id === whisprId ? { ...w, isRead: true } : w
      ));
    }
    return success;
  };

  const deleteWhispr = async (whisprId: string): Promise<boolean> => {
    const success = await deleteWhisprById(whisprId);
    if (success) {
      setWhisprs(prev => prev.filter(w => w.id !== whisprId));
      toast.success('Whispr deleted successfully');
    }
    return success;
  };

  return {
    whisprs,
    isLoading,
    stats,
    markAsRead,
    deleteWhispr
  };
};

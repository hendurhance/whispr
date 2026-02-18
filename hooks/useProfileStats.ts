
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types';

interface ProfileStats {
  totalViews: number;
  totalWhisprs: number;
  weeklyData: number[];
}

export const useProfileStats = (profile: Profile | null, user: User | null) => {
  const supabase = createClient();
  const [weeklyData, setWeeklyData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  const totalViews = profile?.total_views || 0;
  const totalWhisprs = profile?.total_whisprs || 0;

  useEffect(() => {
    if (!user || !profile) return;

    const fetchWeeklyStats = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('weekly_stats')
          .select('date, whisprs')
          .eq('user_id', userId)
          .order('date', { ascending: true });

        if (error) {
          console.error('Error fetching weekly stats:', error);
          return;
        }

        // Initialize array with zeros for all days (Monday = 0, Sunday = 6)
        const weekData = [0, 0, 0, 0, 0, 0, 0];

        if (data && data.length > 0) {
          data.forEach(item => {
            const date = new Date(item.date);
            // Convert Sunday (0) to index 6, and other days to index-1
            const displayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
            weekData[displayIndex] = item.whisprs;
          });
        }

        setWeeklyData(weekData);
      } catch (error) {
        console.error('Error in fetchWeeklyStats:', error);
      }
    };

    fetchWeeklyStats(user.id);
  }, [profile, user]);

  const stats: ProfileStats = {
    totalViews,
    totalWhisprs,
    weeklyData
  };

  return stats;
};

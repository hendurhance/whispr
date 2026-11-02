import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { Profile } from '@/types';
import type { Whispr, WhisprStats } from '@/types/whispr';
import { EMPTY_STATS, INBOX_PAGE_SIZE, WHISPR_COLUMNS, toWhispr, type WhisprRecord } from '@/lib/inbox';

export const getUserSession = cache(async () => {
  const supabase = await createClient();

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
});

export const getProfileData = cache(async (): Promise<Profile | null> => {
  const user = await getUserSession();
  if (!user) return null;

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) throw new Error('Could not load your profile');
  return profile as Profile | null;
});

export async function requireProfile() {
  const user = await getUserSession();
  if (!user) redirect('/auth');
  const profile = await getProfileData();
  if (!profile) redirect('/setup-profile');
  return { user, profile };
}

export const getInboxPage = cache(async (userId: string): Promise<Whispr[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('whisprs')
    .select(WHISPR_COLUMNS)
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(INBOX_PAGE_SIZE);

  if (error || !data) return [];
  return (data as WhisprRecord[]).map(toWhispr);
});

export const getInboxSummary = cache(async (): Promise<WhisprStats> => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_inbox_summary');

  if (error || !data) return EMPTY_STATS;
  return data as WhisprStats;
});

export const getWhisprDatesSince = cache(async (userId: string, since: string): Promise<string[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('whisprs')
    .select('created_at')
    .eq('user_id', userId)
    .eq('status', 'active')
    .gte('created_at', since)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map((w) => w.created_at as string);
});

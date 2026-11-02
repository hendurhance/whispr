import type { Metadata } from 'next';
import { Dashboard } from '@/components/dashboard/dashboard';
import { requireProfile, getInboxPage, getInboxSummary } from '@/lib/server/profile-data';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'View and manage your anonymous whisprs',
  robots: {
    index: false,
    follow: false,
  },
};

export const revalidate = 30;

export default async function DashboardRoute() {
  const { user, profile } = await requireProfile();
  const [whisprs, stats] = await Promise.all([getInboxPage(user.id), getInboxSummary()]);

  return <Dashboard initialWhisprs={whisprs} initialStats={stats} initialUser={user} initialProfile={profile} />;
}

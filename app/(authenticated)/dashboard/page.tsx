import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Dashboard } from '@/components/dashboard/dashboard';
import { getUserSession, getProfileData, getInboxPage, getInboxSummary } from '@/lib/server/profile-data';

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
  const user = await getUserSession();

  if (!user) {
    redirect('/auth');
  }

  const [whisprs, stats, profile] = await Promise.all([
    getInboxPage(user.id),
    getInboxSummary(),
    getProfileData(),
  ]);

  return <Dashboard initialWhisprs={whisprs} initialStats={stats} initialUser={user} initialProfile={profile} />;
}

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Dashboard } from '@/components/dashboard/dashboard';
import { getWhisprsData, getProfileData } from '@/lib/server/profile-data';

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
  const { whisprs, user } = await getWhisprsData();
  const profile = await getProfileData();

  if (!user) {
    redirect('/auth');
  }

  return <Dashboard initialWhisprs={whisprs} initialUser={user} initialProfile={profile} />;
}

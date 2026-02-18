import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import DashboardPage from '@/components/pages/DashboardPage';
import { getWhisprsData, getProfileData } from '@/lib/server/profile-data';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'View and manage your anonymous feedback',
  robots: {
    index: false,
    follow: false,
  },
};

export const revalidate = 30;

export default async function Dashboard() {
  const { whisprs, user } = await getWhisprsData();
  const profile = await getProfileData();

  if (!user) {
    redirect('/auth');
  }
  
  return <DashboardPage initialWhisprs={whisprs} initialUser={user} initialProfile={profile} />;
}

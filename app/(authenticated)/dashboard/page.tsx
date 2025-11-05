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

// Configure dynamic behavior with revalidation
export const revalidate = 30; // Revalidate every 30 seconds

export default async function Dashboard() {
  // Fetch whisprs and user data server-side
  const { whisprs, user } = await getWhisprsData();
  const profile = await getProfileData();
  
  // Redirect if not authenticated
  if (!user) {
    redirect('/auth');
  }
  
  return <DashboardPage initialWhisprs={whisprs} initialUser={user} initialProfile={profile} />;
}

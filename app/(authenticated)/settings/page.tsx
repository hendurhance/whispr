import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import SettingsPage from '@/components/pages/SettingsPage';
import { getUserSession, getProfileData } from '@/lib/server/profile-data';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account settings and preferences',
  robots: {
    index: false,
    follow: false,
  },
};

// Configure dynamic behavior with revalidation
export const revalidate = 60; // Revalidate every 60 seconds

export default async function Settings() {
  // Fetch user and profile data server-side
  const user = await getUserSession();
  const profile = await getProfileData();
  
  // Redirect if not authenticated
  if (!user) {
    redirect('/auth');
  }
  
  return <SettingsPage initialUser={user} initialProfile={profile} />;
}

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

export const revalidate = 60;

export default async function Settings() {
  const user = await getUserSession();
  const profile = await getProfileData();

  if (!user) {
    redirect('/auth');
  }
  
  return <SettingsPage initialUser={user} initialProfile={profile} />;
}

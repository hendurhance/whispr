import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import SetupProfilePage from '@/components/pages/SetupProfilePage';
import { getUserSession, getProfileData } from '@/lib/server/profile-data';

export const metadata: Metadata = {
  title: 'Setup Profile',
  description: 'Set up your Whispr profile to start receiving anonymous feedback',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SetupProfile() {
  const user = await getUserSession();
  const profile = await getProfileData();

  if (!user) {
    redirect('/auth');
  }

  if (profile) {
    redirect('/dashboard');
  }
  
  return <SetupProfilePage initialUser={user} />;
}

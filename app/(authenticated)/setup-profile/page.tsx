import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SetupProfileForm } from '@/components/setup-profile/setup-profile-form';
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
  
  return <SetupProfileForm />;
}

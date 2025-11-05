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
  // Fetch user session server-side
  const user = await getUserSession();
  const profile = await getProfileData();
  
  // Redirect if not authenticated
  if (!user) {
    redirect('/auth');
  }
  
  // Redirect to dashboard if profile already setup
  if (profile) {
    redirect('/dashboard');
  }
  
  return <SetupProfilePage initialUser={user} />;
}

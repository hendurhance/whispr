import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import ProfilePage from '@/components/pages/ProfilePage';
import { getUserSession, getProfileData } from '@/lib/server/profile-data';

export const metadata: Metadata = {
  title: 'Edit Profile',
  description: 'Customize your Whispr profile and appearance',
  robots: {
    index: false,
    follow: false,
  },
};

export const revalidate = 60;

export default async function Profile() {
  const user = await getUserSession();
  const profile = await getProfileData();

  if (!user) {
    redirect('/auth');
  }
  
  return <ProfilePage initialUser={user} initialProfile={profile} />;
}

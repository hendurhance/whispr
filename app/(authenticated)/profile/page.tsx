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

// Configure dynamic behavior with revalidation
export const revalidate = 60; // Revalidate every 60 seconds

export default async function Profile() {
  // Fetch user and profile data server-side
  const user = await getUserSession();
  const profile = await getProfileData();
  
  // Redirect if not authenticated
  if (!user) {
    redirect('/auth');
  }
  
  return <ProfilePage initialUser={user} initialProfile={profile} />;
}

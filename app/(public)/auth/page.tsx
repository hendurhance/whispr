import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getUserSession, getProfileData } from '@/lib/server/profile-data';
import { AuthScreen } from '@/components/auth/auth-form';

export const metadata: Metadata = {
  title: 'Sign In - Join Whispr',
  description: 'Sign in to Whispr and start collecting anonymous questions, confessions and honest feedback. Share your link and find out what people really think.',
  openGraph: {
    title: 'Sign In - Join Whispr',
    description: 'Join Whispr and start receiving anonymous messages and honest feedback from friends.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function Auth() {
  const user = await getUserSession();
  if (user) {
    const profile = await getProfileData();
    redirect(profile ? '/dashboard' : '/setup-profile');
  }

  return (
    <Suspense fallback={<div data-tier="press" className="min-h-[100dvh] bg-paper" />}>
      <AuthScreen />
    </Suspense>
  );
}

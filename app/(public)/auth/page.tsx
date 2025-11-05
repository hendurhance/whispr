import type { Metadata } from 'next';
import { Suspense } from 'react';
import AuthPage from '@/components/pages/AuthPage';

export const metadata: Metadata = {
  title: 'Sign In - Join Whispr',
  description: 'Sign in to Whispr and start receiving anonymous messages, honest feedback, and confessions from friends. Play Q&A games and discover real opinions.',
  openGraph: {
    title: 'Sign In - Join Whispr',
    description: 'Join Whispr and start receiving anonymous messages and honest feedback from friends.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Auth() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthPage />
    </Suspense>
  );
}

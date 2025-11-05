import type { Metadata } from 'next';
import TermsPage from '@/components/pages/TermsPage';

export const metadata: Metadata = {
  title: 'Terms of Service - Whispr',
  description: 'Whispr terms of service, usage guidelines, and community rules. Learn about our policies for anonymous messaging and honest feedback.',
  openGraph: {
    title: 'Terms of Service - Whispr',
    description: 'Whispr terms of service and usage guidelines for anonymous messaging.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Terms() {
  return <TermsPage />;
}

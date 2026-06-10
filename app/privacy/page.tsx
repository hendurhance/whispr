import type { Metadata } from 'next';
import { PrivacyContent } from '@/components/legal/privacy-content';

export const metadata: Metadata = {
  title: 'Privacy Policy - Whispr',
  description: 'Learn how Whispr protects your privacy and handles anonymous messages. Our commitment to keeping your feedback secure and anonymous.',
  openGraph: {
    title: 'Privacy Policy - Whispr',
    description: 'Learn how Whispr protects your privacy and handles anonymous messages.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Privacy() {
  return <PrivacyContent />;
}

import type { Metadata } from 'next';
import LandingPage from '@/components/pages/LandingPage';

export const metadata: Metadata = {
  title: 'Whispr - Send Anonymous Messages & Get Honest Feedback',
  description: 'Get real feedback from real friends. Play anonymous Q&A games, receive confessions, and discover what people really think. Ask me anything, never have I ever, 3 words, and more!',
  keywords: [
    'anonymous messages',
    'send anonymous messages',
    'anonymous feedback',
    'honest feedback',
    'ask me anything',
    'never have I ever',
    'confessions',
    '3 words',
    'anonymous questions',
    'real friends',
    'honest opinions',
  ],
  openGraph: {
    title: 'Whispr - Send Anonymous Messages & Get Honest Feedback',
    description: 'Get real feedback from real friends. Play anonymous Q&A games and discover what people really think.',
    type: 'website',
    url: '/',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Whispr - Anonymous messages and honest feedback',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Whispr - Send Anonymous Messages & Get Honest Feedback',
    description: 'Get real feedback from real friends. Play anonymous Q&A games and discover what people really think.',
    images: ['/og-image.png'],
  },
};

export default function Home() {
  return <LandingPage />;
}

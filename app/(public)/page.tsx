import type { Metadata } from 'next';
import { Landing } from '@/components/landing/landing';

export const metadata: Metadata = {
  title: 'Whispr - Send Anonymous Messages & Get Honest Feedback',
  description: 'Whispr is the open-source way to collect anonymous questions, confessions, roasts and honest feedback. Share your link, find out what people really think, and turn the best into a share card.',
  keywords: [
    'anonymous messages',
    'send anonymous messages',
    'anonymous q&a',
    'anonymous questions',
    'anonymous feedback',
    'honest feedback',
    'ask me anything',
    'confessions',
    'ngl alternative',
  ],
  openGraph: {
    title: 'Whispr - Send Anonymous Messages & Get Honest Feedback',
    description: 'Collect anonymous questions, confessions and honest feedback. Share your link and find out what people really think.',
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
    description: 'Collect anonymous questions, confessions and honest feedback. Share your link and find out what people really think.',
    images: ['/og-image.png'],
  },
};

export default function Home() {
  return <Landing />;
}

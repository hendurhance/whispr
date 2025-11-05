import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://whispr.app';
const APP_NAME = "Whispr";
const APP_DESCRIPTION = "Send and receive anonymous messages, confessions, and honest feedback. Play Q&A games, get real opinions, and connect with friends through anonymous questions.";

export const metadata: Metadata = {
  title: {
    template: "%s",
    default: "Whispr - Anonymous Q&A and Honest Feedback",
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  keywords: [
    "anonymous messages",
    "anonymous feedback",
    "ngl",
    "send anonymous messages",
    "anonymous questions",
    "honest feedback",
    "anonymous confessions",
    "q&a games",
    "ask me anything",
    "never have I ever",
    "anonymous compliments",
    "3 words",
    "real friends",
    "honest opinions",
    "whispr",
    "anonymous app",
    "secret messages",
    "truth or dare",
    "confession app"
  ],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  publisher: APP_NAME,
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL(APP_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: APP_NAME,
    title: "Whispr - Anonymous Q&A and Honest Feedback",
    description: APP_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Whispr - Send and receive anonymous messages",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@whisprapp",
    creator: "@whisprapp",
    title: "Whispr - Anonymous Q&A and Honest Feedback",
    description: APP_DESCRIPTION,
    images: {
      url: "/og-image.png",
      alt: "Whispr - Send and receive anonymous messages",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icons/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME,
  },
  verification: {
    // Add your verification codes here when ready
    // google: 'google-site-verification-code',
    // yandex: 'yandex-verification-code',
  },
  category: 'social',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD structured data for better SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Whispr',
    applicationCategory: 'SocialNetworkingApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Send and receive anonymous messages, confessions, and honest feedback. Play Q&A games, get real opinions, and connect with friends.',
    url: APP_URL,
    sameAs: [
      'https://twitter.com/whisprapp',
      'https://instagram.com/whispr.app',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '10000',
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <div id="root">
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#252547',
                color: '#e0e0e6',
                border: '1px solid #7A31FF',
              },
              success: {
                iconTheme: {
                  primary: '#56ffb2',
                  secondary: '#252547',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ff5656',
                  secondary: '#252547',
                },
              },
            }}
          />
        </div>
      </body>
    </html>
  );
}

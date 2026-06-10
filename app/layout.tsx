import type { Metadata } from "next";
import Script from "next/script";
import { AppToaster } from "@/components/ui/toaster";
import { ServiceWorker } from "@/components/pwa/service-worker";
import "./globals.css";
import { fontDisplay, fontBody, fontVoice, fontSerif } from "@/lib/fonts";
import CONFIGURATIONS from "@/configs";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://trywhispr.me';
const APP_NAME = "Whispr";
const APP_DESCRIPTION = "Send and receive anonymous messages, questions, confessions and honest feedback. Share your Whispr link, find out what people really think, and turn the best into a share card.";

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
    "ngl alternative",
    "send anonymous messages",
    "anonymous questions",
    "anonymous q&a",
    "honest feedback",
    "anonymous confessions",
    "ask me anything",
    "anonymous compliments",
    "anonymous roast",
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
    site: "@trywhispr",
    creator: "@trywhispr",
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
      { url: '/icons/apple-touch-icon.png' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME,
  },
  verification: {
    google: CONFIGURATIONS.VERIFICATIONS.GOOGLE,
  },
  category: 'social',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${APP_URL}/#organization`,
        name: APP_NAME,
        url: APP_URL,
        logo: `${APP_URL}/icons/favicon.svg`,
        sameAs: [
          'https://twitter.com/trywhispr',
          'https://instagram.com/trywhispr',
          'https://github.com/hendurhance/whispr',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${APP_URL}/#website`,
        name: APP_NAME,
        url: APP_URL,
        inLanguage: 'en',
        publisher: { '@id': `${APP_URL}/#organization` },
      },
      {
        '@type': 'SoftwareApplication',
        name: APP_NAME,
        applicationCategory: 'SocialNetworkingApplication',
        operatingSystem: 'Web, iOS, Android',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description: APP_DESCRIPTION,
        url: APP_URL,
        publisher: { '@id': `${APP_URL}/#organization` },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${fontDisplay.variable} ${fontBody.variable} ${fontVoice.variable} ${fontSerif.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <Script id="desk-theme" strategy="beforeInteractive">
          {`(function(){try{if(/^\\/(dashboard|stats|profile|settings|setup-profile)/.test(location.pathname)){var t=localStorage.getItem('desk-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.setAttribute('data-appearance','dark')}}}catch(e){}})()`}
        </Script>
        <div id="root">
          {children}
          <AppToaster />
          <ServiceWorker />
        </div>
      </body>
    </html>
  );
}

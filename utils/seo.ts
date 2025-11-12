/**
 * SEO Utilities for Whispr
 * Based on best practices from ngl.link and modern SEO standards
 */

export const APP_CONFIG = {
  name: 'Whispr',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://trywhispr.me',
  description: 'Send and receive anonymous messages, confessions, and honest feedback. Play Q&A games, get real opinions, and connect with friends through anonymous questions.',
  social: {
    twitter: '@trywhispr',
    instagram: '@trywhispr',
  },
};

export const SEO_KEYWORDS = {
  primary: [
    'anonymous messages',
    'anonymous feedback',
    'send anonymous messages',
    'honest feedback',
    'whispr',
  ],
  secondary: [
    'anonymous questions',
    'ask me anything',
    'never have I ever',
    'confessions',
    '3 words',
    'honest opinions',
    'real friends',
    'anonymous compliments',
  ],
  games: [
    'q&a games',
    'anonymous q&a',
    'truth or dare',
    'confession games',
    'question games',
  ],
};

/**
 * Generate dynamic meta description for user profiles
 */
export function generateProfileDescription(
  displayName: string,
  username: string,
  bio?: string
): string {
  if (bio) {
    return `${bio} | Send ${displayName} anonymous messages, questions, and honest feedback on Whispr.`;
  }
  
  const templates = [
    `Send ${displayName} anonymous messages and honest feedback. Ask questions, share confessions, and get real with ${displayName} on Whispr.`,
    `Want to tell ${displayName} something anonymously? Send honest feedback, confessions, or questions to @${username} on Whispr.`,
    `${displayName} is on Whispr! Send anonymous messages, ask questions, and share your honest thoughts with ${displayName}.`,
  ];
  
  return templates[0];
}

/**
 * Generate dynamic page title for user profiles
 */
export function generateProfileTitle(
  displayName: string,
  username: string
): string {
  return `${displayName} (@${username}) - Send Anonymous Messages | Whispr`;
}

/**
 * Common Open Graph image configuration
 */
export function getOGImage(customImage?: string) {
  return customImage
    ? {
        url: customImage,
        width: 400,
        height: 400,
        alt: 'Profile picture',
        type: 'image/jpeg',
      }
    : {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Whispr - Send and receive anonymous messages',
        type: 'image/png',
      };
}

/**
 * Generate JSON-LD structured data for user profiles
 */
export function generateProfileJsonLd(profile: {
  username: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: profile.displayName || profile.username,
      alternateName: profile.username,
      description: profile.bio,
      image: profile.avatarUrl,
      url: `${APP_CONFIG.url}/${profile.username}`,
    },
  };
}

/**
 * Generate JSON-LD for organization
 */
export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: APP_CONFIG.name,
    url: APP_CONFIG.url,
    logo: `${APP_CONFIG.url}/logo.png`,
    sameAs: [
      `https://twitter.com/${APP_CONFIG.social.twitter.replace('@', '')}`,
      `https://instagram.com/${APP_CONFIG.social.instagram.replace('@', '')}`,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@trywhispr.me',
    },
  };
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${APP_CONFIG.url}${cleanPath}`;
}

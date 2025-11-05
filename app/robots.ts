import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://trywhispr.me';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/settings', '/profile', '/setup-profile', '/api', '/auth/callback'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

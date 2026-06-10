import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { ALL_MARKETING, marketingHref } from '@/lib/marketing';
import { COMPETITOR_SLUGS } from '@/lib/competitors';
import { BLOG_SLUGS } from '@/lib/blog';
import { PROMPT_PACK_SLUGS } from '@/lib/prompts';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://trywhispr.me';
  
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/auth`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const marketingPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/ngl-alternative`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/for-creators`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/safety`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    ...COMPETITOR_SLUGS.map((slug) => ({
      url: `${baseUrl}/vs/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/prompts`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    ...BLOG_SLUGS.map((slug) => ({ url: `${baseUrl}/blog/${slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...PROMPT_PACK_SLUGS.map((slug) => ({ url: `${baseUrl}/prompts/${slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...ALL_MARKETING.map((doc) => ({
      url: `${baseUrl}${marketingHref(doc)}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data: profiles } = await supabase
      .from('profiles')
      .select('username, updated_at')
      .eq('is_indexable', true)
      .order('total_whisprs', { ascending: false })
      .limit(1000);

    const profilePages: MetadataRoute.Sitemap = (profiles || []).map((profile) => ({
      url: `${baseUrl}/${profile.username}`,
      lastModified: new Date(profile.updated_at || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...staticPages, ...marketingPages, ...profilePages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [...staticPages, ...marketingPages];
  }
}

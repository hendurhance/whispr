import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BLOG_POSTS } from '@/lib/blog'
import { BlogPostPage } from '@/components/marketing/blog-post-page'

export const dynamicParams = false

export function generateStaticParams() {
  return Object.keys(BLOG_POSTS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = BLOG_POSTS[slug]
  if (!post) return {}
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: 'article',
      title: post.metaTitle,
      description: post.metaDescription,
      url: `/blog/${slug}`,
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified || post.datePublished,
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = BLOG_POSTS[slug]
  if (!post) notFound()
  return <BlogPostPage post={post} />
}

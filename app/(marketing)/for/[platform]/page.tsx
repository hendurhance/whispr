import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PLATFORMS } from '@/lib/marketing'
import { MarketingDocPage } from '@/components/marketing/marketing-doc'

export const dynamicParams = false

export function generateStaticParams() {
  return Object.keys(PLATFORMS).map((platform) => ({ platform }))
}

export async function generateMetadata({ params }: { params: Promise<{ platform: string }> }): Promise<Metadata> {
  const { platform } = await params
  const doc = PLATFORMS[platform]
  if (!doc) return {}
  return {
    title: doc.metaTitle,
    description: doc.metaDescription,
    alternates: { canonical: `/for/${platform}` },
    openGraph: { title: doc.metaTitle, description: doc.metaDescription, url: `/for/${platform}` },
  }
}

export default async function Page({ params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params
  const doc = PLATFORMS[platform]
  if (!doc) notFound()
  return <MarketingDocPage doc={doc} />
}

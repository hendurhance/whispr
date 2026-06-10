import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { COMPETITORS } from '@/lib/competitors'
import { ComparisonPage } from '@/components/marketing/comparison-page'

export const dynamicParams = false

export function generateStaticParams() {
  return Object.keys(COMPETITORS).map((competitor) => ({ competitor }))
}

export async function generateMetadata({ params }: { params: Promise<{ competitor: string }> }): Promise<Metadata> {
  const { competitor } = await params
  const c = COMPETITORS[competitor]
  if (!c) return {}
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: `/vs/${competitor}` },
    openGraph: { title: c.metaTitle, description: c.metaDescription, url: `/vs/${competitor}` },
  }
}

export default async function Page({ params }: { params: Promise<{ competitor: string }> }) {
  const { competitor } = await params
  const c = COMPETITORS[competitor]
  if (!c) notFound()
  return <ComparisonPage competitor={c} />
}

import type { Metadata } from 'next'
import { USE_CASES } from '@/lib/marketing'
import { MarketingDocPage } from '@/components/marketing/marketing-doc'

const doc = USE_CASES['anonymous-dares']

export const metadata: Metadata = {
  title: doc.metaTitle,
  description: doc.metaDescription,
  alternates: { canonical: '/anonymous-dares' },
  openGraph: { title: doc.metaTitle, description: doc.metaDescription, url: '/anonymous-dares' },
}

export default function Page() {
  return <MarketingDocPage doc={doc} />
}

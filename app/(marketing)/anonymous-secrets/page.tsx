import type { Metadata } from 'next'
import { USE_CASES } from '@/lib/marketing'
import { MarketingDocPage } from '@/components/marketing/marketing-doc'

const doc = USE_CASES['anonymous-secrets']

export const metadata: Metadata = {
  title: doc.metaTitle,
  description: doc.metaDescription,
  alternates: { canonical: '/anonymous-secrets' },
  openGraph: { title: doc.metaTitle, description: doc.metaDescription, url: '/anonymous-secrets' },
}

export default function Page() {
  return <MarketingDocPage doc={doc} />
}

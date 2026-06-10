import type { Metadata } from 'next'
import { USE_CASES } from '@/lib/marketing'
import { MarketingDocPage } from '@/components/marketing/marketing-doc'

const doc = USE_CASES['anonymous-hot-takes']

export const metadata: Metadata = {
  title: doc.metaTitle,
  description: doc.metaDescription,
  alternates: { canonical: '/anonymous-hot-takes' },
  openGraph: { title: doc.metaTitle, description: doc.metaDescription, url: '/anonymous-hot-takes' },
}

export default function Page() {
  return <MarketingDocPage doc={doc} />
}

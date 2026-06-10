import type { Metadata } from 'next'
import { USE_CASES } from '@/lib/marketing'
import { MarketingDocPage } from '@/components/marketing/marketing-doc'

const doc = USE_CASES['anonymous-feedback']

export const metadata: Metadata = {
  title: doc.metaTitle,
  description: doc.metaDescription,
  alternates: { canonical: '/anonymous-feedback' },
  openGraph: { title: doc.metaTitle, description: doc.metaDescription, url: '/anonymous-feedback' },
}

export default function Page() {
  return <MarketingDocPage doc={doc} />
}

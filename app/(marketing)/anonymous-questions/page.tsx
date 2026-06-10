import type { Metadata } from 'next'
import { USE_CASES } from '@/lib/marketing'
import { MarketingDocPage } from '@/components/marketing/marketing-doc'

const doc = USE_CASES['anonymous-questions']

export const metadata: Metadata = {
  title: doc.metaTitle,
  description: doc.metaDescription,
  alternates: { canonical: '/anonymous-questions' },
  openGraph: { title: doc.metaTitle, description: doc.metaDescription, url: '/anonymous-questions' },
}

export default function Page() {
  return <MarketingDocPage doc={doc} />
}

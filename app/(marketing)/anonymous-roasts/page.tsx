import type { Metadata } from 'next'
import { USE_CASES } from '@/lib/marketing'
import { MarketingDocPage } from '@/components/marketing/marketing-doc'

const doc = USE_CASES['anonymous-roasts']

export const metadata: Metadata = {
  title: doc.metaTitle,
  description: doc.metaDescription,
  alternates: { canonical: '/anonymous-roasts' },
  openGraph: { title: doc.metaTitle, description: doc.metaDescription, url: '/anonymous-roasts' },
}

export default function Page() {
  return <MarketingDocPage doc={doc} />
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PROMPT_PACKS } from '@/lib/prompts'
import { PromptPackPage } from '@/components/marketing/prompt-pack-page'

export const dynamicParams = false

export function generateStaticParams() {
  return Object.keys(PROMPT_PACKS).map((pack) => ({ pack }))
}

export async function generateMetadata({ params }: { params: Promise<{ pack: string }> }): Promise<Metadata> {
  const { pack } = await params
  const p = PROMPT_PACKS[pack]
  if (!p) return {}
  return {
    title: p.metaTitle,
    description: p.metaDescription,
    alternates: { canonical: `/prompts/${pack}` },
    openGraph: { title: p.metaTitle, description: p.metaDescription, url: `/prompts/${pack}` },
  }
}

export default async function Page({ params }: { params: Promise<{ pack: string }> }) {
  const { pack } = await params
  const p = PROMPT_PACKS[pack]
  if (!p) notFound()
  return <PromptPackPage pack={p} />
}

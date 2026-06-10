import type { Metadata } from 'next'
import Link from 'next/link'
import { ALL_PROMPT_PACKS } from '@/lib/prompts'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { PressLink } from '@/components/landing/press-link'

export const metadata: Metadata = {
  title: 'Anonymous Message Prompts & Question Ideas | Whispr',
  description:
    'Copy-and-send prompt packs: anonymous questions, confessions, roasts, dares and hot takes. Free ideas to post with your link or send to a friend.',
  alternates: { canonical: '/prompts' },
  openGraph: {
    title: 'Anonymous Message Prompts & Question Ideas | Whispr',
    description: 'Copy-and-send prompt packs for anonymous messages.',
    url: '/prompts',
  },
}

export default function Page() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-3xl px-5 py-8">
        <nav aria-label="Breadcrumb" className="font-voice text-xs text-ink-faint">
          <Link href="/" className="hover:text-ink">Home</Link> <span className="px-1">/</span> <span className="text-ink">Prompts</span>
        </nav>

        <p className="mt-7 font-voice text-xs uppercase tracking-[0.2em] text-flame">Prompt library</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl">Anonymous message prompts</h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">
          Stuck on what to ask — or what to send? Grab a prompt from any pack below. Tap to copy, then post it with your Whispr link or send it to a friend anonymously.
        </p>
        <div className="mt-7">
          <PressLink href="/auth">Get your free link →</PressLink>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {ALL_PROMPT_PACKS.map((pack) => (
            <Link
              key={pack.slug}
              href={`/prompts/${pack.slug}`}
              className="flex flex-col rounded-[4px] border-2 border-ink bg-paper-2 p-5 shadow-[4px_4px_0_0_var(--color-ink)] transition-transform hover:-translate-y-0.5"
            >
              <p className="font-voice text-[11px] uppercase tracking-[0.15em] text-ink-faint">{pack.prompts.length} ideas</p>
              <h2 className="mt-1 font-display text-xl font-extrabold tracking-tight text-ink">{pack.title}</h2>
              <p className="mt-2 flex-1 font-voice text-sm leading-relaxed text-ink-soft">“{pack.prompts[0]}”</p>
              <span className="mt-4 font-display text-sm font-bold text-flame">View pack →</span>
            </Link>
          ))}
        </div>
      </main>
    </MarketingShell>
  )
}

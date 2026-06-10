import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles, SlidersHorizontal, ShieldCheck, BarChart3 } from 'lucide-react'
import { APP_URL } from '@/configs'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { PressLink } from '@/components/landing/press-link'

export const metadata: Metadata = {
  title: 'Anonymous Q&A & Feedback for Creators | Whispr',
  description:
    'The anonymous feedback and Q&A tool for creators and streamers. Collect honest questions, turn them into share cards, and stay in full control. Free, open-source.',
  alternates: { canonical: '/for-creators' },
  openGraph: {
    title: 'Anonymous Q&A & Feedback for Creators | Whispr',
    description: 'Audience-sourced content, honest feedback, and full control — free and open-source.',
    url: '/for-creators',
  },
}

const VALUE = [
  { icon: Sparkles, title: 'Audience-sourced content, on tap', body: 'One link turns your audience into an endless content queue — questions to answer on camera, roasts and hot takes to react to, confessions to read out. Make a share card from the best ones and every screenshot carries your link back, so the next batch is already on the way.' },
  { icon: SlidersHorizontal, title: 'You control everything', body: 'Your inbox is private — no public pile-on, no comment wall. Pause incoming whenever, delete anything instantly, and hide your page from search in one tap. You decide what (if anything) ever gets posted.' },
  { icon: ShieldCheck, title: 'Trust your audience can verify', body: 'Whispr is open-source and ad-free, so anonymity isn’t a promise — it’s auditable. No dark patterns, no paywalled “who sent this.” That’s why it’s a tool you can actually put your name behind.' },
  { icon: BarChart3, title: 'Simple, private insights', body: 'See your whispr counts by type, your last-7-days activity, and profile views — enough to know what’s landing, never anything that breaks sender anonymity.' },
]

const FAQS = [
  { q: 'Is Whispr good for streamers?', a: 'Yes — collect anonymous questions before and during a stream, read the best ones live, and post a share card afterward. It works great as an on-stream Q&A or “roast the streamer” segment.' },
  { q: 'Does it cost anything?', a: 'No — Whispr is free, with no ads and no paywalled features.' },
  { q: 'Can my audience stay anonymous?', a: 'Yes. Senders need no account and are anonymous to you; sender identity is never shown or published. See our safety page for the details.' },
  { q: 'How do I answer messages?', a: 'On your own socials — pick a message, turn it into a share card, and post it. Whispr never hosts the reply, which keeps your audience flowing back to you.' },
]

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'FAQPage', mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: APP_URL },
          { '@type': 'ListItem', position: 2, name: 'For creators', item: `${APP_URL}/for-creators` },
        ],
      },
    ],
  }

  return (
    <MarketingShell>
      <main className="mx-auto max-w-3xl px-5 py-8">
        <nav aria-label="Breadcrumb" className="font-voice text-xs text-ink-faint">
          <Link href="/" className="hover:text-ink">Home</Link> <span className="px-1">/</span> <span className="text-ink">For creators</span>
        </nav>

        <p className="mt-7 font-voice text-xs uppercase tracking-[0.2em] text-flame">For creators &amp; streamers</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl">Anonymous Q&amp;A your audience will actually use</h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">
          Whispr is the anonymous feedback and Q&amp;A tool built for creators: collect the honest questions and hot takes people won’t say with their name attached, turn the best into content, and keep full control the whole time. Free and open-source.
        </p>
        <div className="mt-7">
          <PressLink href="/auth">Get your free link →</PressLink>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {VALUE.map((v) => (
            <section key={v.title} className="rounded-[4px] border-2 border-ink bg-paper-2 p-6 shadow-[4px_4px_0_0_var(--color-ink)]">
              <span className="flex size-11 items-center justify-center rounded-full border-2 border-ink bg-flame text-white">
                <v.icon className="size-5" strokeWidth={2.25} />
              </span>
              <h2 className="mt-4 font-display text-lg font-extrabold tracking-tight">{v.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{v.body}</p>
            </section>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-extrabold tracking-tight">FAQ</h2>
          <div className="mt-4 space-y-4">
            {FAQS.map((f) => (
              <div key={f.q} className="rounded-[4px] border-2 border-ink bg-paper-2 p-5 shadow-[3px_3px_0_0_var(--color-ink)]">
                <p className="font-display font-bold">{f.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-[4px] border-2 border-ink bg-paper-2 p-8 text-center shadow-[6px_6px_0_0_var(--color-ink)]">
          <h2 className="font-display text-3xl font-extrabold tracking-tight">Turn your audience into content</h2>
          <p className="mx-auto mt-3 max-w-md text-ink-soft">Claim your free link and start collecting honest, anonymous questions today.</p>
          <div className="mt-6 flex justify-center">
            <PressLink href="/auth">Get your free link →</PressLink>
          </div>
        </section>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </MarketingShell>
  )
}

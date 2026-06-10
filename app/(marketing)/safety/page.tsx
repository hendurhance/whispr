import type { Metadata } from 'next'
import Link from 'next/link'
import { EyeOff, Lock, SlidersHorizontal, Code2, Flag } from 'lucide-react'
import { APP_URL } from '@/configs'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { PressLink } from '@/components/landing/press-link'

export const metadata: Metadata = {
  title: 'Safety & Anonymity — How Whispr Keeps You Safe | Whispr',
  description:
    'How anonymity works on Whispr: senders are anonymous, your messages stay private, and you control everything. Open-source, ad-free, no dark patterns.',
  alternates: { canonical: '/safety' },
  openGraph: {
    title: 'Safety & Anonymity at Whispr',
    description: 'How anonymity works, what stays private, and the controls you have.',
    url: '/safety',
  },
}

const FAQS = [
  { q: 'Can someone find out who sent a message?', a: 'No. Senders are anonymous to you — there’s nothing to sign up with to send, and we never reveal sender identity to recipients.' },
  { q: 'Do you store who I am or who sent a message?', a: 'We keep only the minimal technical signals needed to prevent spam and abuse. They’re never shown to you, never attached to a message, and never published.' },
  { q: 'Are the messages I receive public?', a: 'No. Received whisprs live only in your private inbox. Whispr has no public message feed and never publishes anything you receive.' },
  { q: 'How do I stop getting messages?', a: 'Pause your inbox anytime from your dashboard — you stop accepting new whisprs immediately, and you can turn it back on whenever you like.' },
  { q: 'Is Whispr safe to use?', a: 'It’s open-source, so anyone can verify exactly how it works; it’s ad-free with no dark patterns; and you can delete anything or pause at will. If something crosses a line, report it to support@trywhispr.me.' },
]

const PRINCIPLES = [
  { icon: EyeOff, title: 'How anonymity actually works', body: 'When someone sends you a whispr, there’s no name or account attached — sending requires no sign-up. You see the message and its type, never the sender. To keep the system safe from spam and abuse, we record minimal technical signals on submission; those are used only for abuse-prevention and are never shown to you or published.' },
  { icon: Lock, title: 'Your messages stay private', body: 'Everything you receive lives in your inbox and is visible only to you. There’s no public feed and no in-app replies — nothing you receive is ever published. If you want to respond, you choose a message and turn it into a share card to post on your own socials. You decide what, if anything, ever leaves your inbox.' },
  { icon: SlidersHorizontal, title: 'You’re always in control', body: 'Pause your inbox to stop new whisprs instantly. Delete any message permanently. Hide your public page from search engines in one tap. These controls live in your dashboard and take effect immediately.' },
  { icon: Code2, title: 'Open by design', body: 'Whispr is open-source (AGPL) — anyone can read exactly how anonymity and data handling work. No ads, no paywalled “who sent this” hints, no dark patterns. Trust you can verify, not just a promise.' },
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
          { '@type': 'ListItem', position: 2, name: 'Safety', item: `${APP_URL}/safety` },
        ],
      },
    ],
  }

  return (
    <MarketingShell>
      <main className="mx-auto max-w-3xl px-5 py-8">
        <nav aria-label="Breadcrumb" className="font-voice text-xs text-ink-faint">
          <Link href="/" className="hover:text-ink">Home</Link> <span className="px-1">/</span> <span className="text-ink">Safety</span>
        </nav>

        <p className="mt-7 font-voice text-xs uppercase tracking-[0.2em] text-flame">Trust &amp; safety</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl">Anonymity, done honestly</h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">
          Anonymity is only worth anything if you can trust how it works. Here’s exactly what Whispr does with anonymous messages — who can see what, what we keep, and the controls you always have.
        </p>

        <div className="mt-10 space-y-5">
          {PRINCIPLES.map((p) => (
            <section key={p.title} className="flex gap-4 rounded-[4px] border-2 border-ink bg-paper-2 p-6 shadow-[4px_4px_0_0_var(--color-ink)]">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-flame text-white">
                <p.icon className="size-5" strokeWidth={2.25} />
              </span>
              <div>
                <h2 className="font-display text-xl font-extrabold tracking-tight">{p.title}</h2>
                <p className="mt-2 leading-relaxed text-ink-soft">{p.body}</p>
              </div>
            </section>
          ))}
        </div>

        <section className="mt-10 rounded-[4px] border-2 border-ink bg-paper p-6 shadow-[4px_4px_0_0_var(--color-ink)]">
          <div className="flex items-center gap-3">
            <Flag className="size-5 text-ember" strokeWidth={2.25} />
            <h2 className="font-display text-xl font-extrabold tracking-tight">Reporting abuse</h2>
          </div>
          <p className="mt-3 leading-relaxed text-ink-soft">
            If you receive something harmful or believe someone is misusing Whispr, email{' '}
            <a href="mailto:support@trywhispr.me" className="font-semibold text-ink underline underline-offset-2">support@trywhispr.me</a>{' '}
            and we’ll act on it. In the meantime you can delete the message and pause your inbox.
          </p>
        </section>

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
          <h2 className="font-display text-3xl font-extrabold tracking-tight">Anonymous, on your terms</h2>
          <p className="mx-auto mt-3 max-w-md text-ink-soft">Claim your free link and start collecting honest, anonymous messages — with full control.</p>
          <div className="mt-6 flex justify-center">
            <PressLink href="/auth">Get your free link →</PressLink>
          </div>
        </section>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </MarketingShell>
  )
}

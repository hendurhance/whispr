import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, Minus } from 'lucide-react'
import { APP_URL } from '@/configs'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { PressLink } from '@/components/landing/press-link'

export const metadata: Metadata = {
  title: 'NGL Alternative — Open-Source Anonymous Messages You Control | Whispr',
  description:
    'Looking for an NGL alternative? Whispr is the open-source, ad-free way to collect anonymous messages — with custom pages, share cards, and full delete/pause control. Free.',
  alternates: { canonical: '/ngl-alternative' },
  openGraph: {
    title: 'NGL Alternative — Open-Source Anonymous Messages | Whispr',
    description: 'The open-source, ad-free NGL alternative. Anonymous messages you actually control.',
    url: '/ngl-alternative',
  },
}

const ROWS: { label: string; whispr: string | true; ngl: string | true | false }[] = [
  { label: 'Truly anonymous senders', whispr: true, ngl: true },
  { label: 'No account needed to send', whispr: true, ngl: true },
  { label: 'Open-source & auditable', whispr: 'AGPL, public repo', ngl: false },
  { label: 'No ads or paywalled “hints”', whispr: true, ngl: '—' },
  { label: 'Custom page (accent + light/dark)', whispr: true, ngl: 'Limited' },
  { label: 'Printable share cards for your story', whispr: true, ngl: '—' },
  { label: 'Delete & pause anytime', whispr: true, ngl: '—' },
  { label: 'Free to use', whispr: true, ngl: 'Free + upsell' },
]

const FAQS = [
  { q: 'Is Whispr a good NGL alternative?', a: 'Yes — Whispr does the same core thing (a link that collects anonymous messages) but is open-source, ad-free, more customizable, and gives you delete/pause control. It’s free.' },
  { q: 'Can I move from NGL to Whispr?', a: 'Just claim your free Whispr link (trywhispr.me/yourname) and swap it into your bio/story wherever your NGL link was. There’s nothing to install.' },
  { q: 'Is Whispr really anonymous?', a: 'Senders are anonymous to you. We keep only minimal technical identifiers for safety and moderation — never shown on your page.' },
  { q: 'Why open-source?', a: 'Because anonymity is a trust feature. With Whispr you (or anyone) can read the code and verify exactly how it works.' },
]

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: APP_URL },
          { '@type': 'ListItem', position: 2, name: 'NGL alternative', item: `${APP_URL}/ngl-alternative` },
        ],
      },
    ],
  }

  return (
    <MarketingShell>
      <main className="mx-auto max-w-3xl px-5 py-8">
        <nav aria-label="Breadcrumb" className="font-voice text-xs text-ink-faint">
          <Link href="/" className="hover:text-ink">Home</Link> <span className="px-1">/</span> <span className="text-ink">NGL alternative</span>
        </nav>

        <p className="mt-7 font-voice text-xs uppercase tracking-[0.2em] text-flame">Comparison</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl">The open-source NGL alternative</h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">
          NGL proved people love sending anonymous messages. Whispr does the same thing — a link that collects anonymous questions, confessions and honest feedback — but open-source, ad-free, more customizable, and fully under your control. And it’s free.
        </p>
        <div className="mt-7">
          <PressLink href="/auth">Switch in 30 seconds →</PressLink>
        </div>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-extrabold tracking-tight">Whispr vs NGL</h2>
          <div className="mt-4 overflow-hidden rounded-[4px] border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-ink bg-paper-2">
                  <th className="px-4 py-3 font-display font-extrabold">Feature</th>
                  <th className="px-4 py-3 font-display font-extrabold text-flame">Whispr</th>
                  <th className="px-4 py-3 font-display font-extrabold text-ink-faint">NGL</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, i) => (
                  <tr key={r.label} className={i % 2 ? 'bg-paper-2/50' : ''}>
                    <td className="border-t border-ink/15 px-4 py-3 font-medium text-ink">{r.label}</td>
                    <td className="border-t border-ink/15 px-4 py-3">{cell(r.whispr)}</td>
                    <td className="border-t border-ink/15 px-4 py-3">{cell(r.ngl)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 font-voice text-[11px] text-ink-faint">Comparison reflects publicly available information; features change — check both before deciding.</p>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-extrabold tracking-tight">Why people switch</h2>
          <p className="mt-3 leading-relaxed text-ink-soft">
            Two reasons come up again and again: <strong className="text-ink">trust</strong> and <strong className="text-ink">control</strong>. Whispr is open-source, so anonymity isn’t a promise — it’s auditable. And your inbox is yours: read, delete, pause, and choose exactly which messages become share cards. No ads, no paywalled “who sent this” hints, no games.
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
          <h2 className="font-display text-3xl font-extrabold tracking-tight">Try the honest alternative</h2>
          <p className="mx-auto mt-3 max-w-md text-ink-soft">Claim your free Whispr link and swap it in wherever your NGL link lives.</p>
          <div className="mt-6 flex justify-center">
            <PressLink href="/auth">Get your free link →</PressLink>
          </div>
        </section>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </MarketingShell>
  )
}

function cell(v: string | true | false) {
  if (v === true) return <Check className="size-4 text-flame" strokeWidth={3} aria-label="Yes" />
  if (v === false) return <Minus className="size-4 text-ink-faint" aria-label="No" />
  return <span className="text-ink-soft">{v}</span>
}

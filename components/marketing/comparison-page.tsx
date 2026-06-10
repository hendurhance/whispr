import Link from 'next/link'
import { Check, Minus } from 'lucide-react'
import { APP_URL } from '@/configs'
import { type Competitor, COMPETITORS } from '@/lib/competitors'
import { PressLink } from '@/components/landing/press-link'
import { MarketingShell } from './marketing-shell'

export function ComparisonPage({ competitor }: { competitor: Competitor }) {
  const url = `${APP_URL}/vs/${competitor.slug}`
  const others = Object.values(COMPETITORS).filter((c) => c.slug !== competitor.slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'FAQPage', mainEntity: competitor.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: APP_URL },
          { '@type': 'ListItem', position: 2, name: `vs ${competitor.name}`, item: url },
        ],
      },
    ],
  }

  return (
    <MarketingShell>
      <main className="mx-auto max-w-3xl px-5 py-8">
        <nav aria-label="Breadcrumb" className="font-voice text-xs text-ink-faint">
          <Link href="/" className="hover:text-ink">Home</Link> <span className="px-1">/</span> <span className="text-ink">vs {competitor.name}</span>
        </nav>

        <p className="mt-7 font-voice text-xs uppercase tracking-[0.2em] text-flame">Comparison</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl">{competitor.h1}</h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">{competitor.lede}</p>
        <div className="mt-7">
          <PressLink href="/auth">Get your free link →</PressLink>
        </div>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-extrabold tracking-tight">Whispr vs {competitor.name}</h2>
          <div className="mt-4 overflow-hidden rounded-[4px] border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-ink bg-paper-2">
                  <th className="px-4 py-3 font-display font-extrabold">Feature</th>
                  <th className="px-4 py-3 font-display font-extrabold text-flame">Whispr</th>
                  <th className="px-4 py-3 font-display font-extrabold text-ink-faint">{competitor.name}</th>
                </tr>
              </thead>
              <tbody>
                {competitor.rows.map((r, i) => (
                  <tr key={r.label} className={i % 2 ? 'bg-paper-2/50' : ''}>
                    <td className="border-t border-ink/15 px-4 py-3 font-medium text-ink">{r.label}</td>
                    <td className="border-t border-ink/15 px-4 py-3">{cell(r.whispr)}</td>
                    <td className="border-t border-ink/15 px-4 py-3">{cell(r.them)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 font-voice text-[11px] text-ink-faint">{competitor.footnote}</p>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-extrabold tracking-tight">Why people switch</h2>
          {competitor.whySwitch.map((p, i) => (
            <p key={i} className="mt-3 leading-relaxed text-ink-soft">{p}</p>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-extrabold tracking-tight">FAQ</h2>
          <div className="mt-4 space-y-4">
            {competitor.faqs.map((f) => (
              <div key={f.q} className="rounded-[4px] border-2 border-ink bg-paper-2 p-5 shadow-[3px_3px_0_0_var(--color-ink)]">
                <p className="font-display font-bold">{f.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-[4px] border-2 border-ink bg-paper-2 p-8 text-center shadow-[6px_6px_0_0_var(--color-ink)]">
          <h2 className="font-display text-3xl font-extrabold tracking-tight">Try the honest alternative</h2>
          <p className="mx-auto mt-3 max-w-md text-ink-soft">Claim your free Whispr link and swap it in wherever your {competitor.name} link lives.</p>
          <div className="mt-6 flex justify-center">
            <PressLink href="/auth">Get your free link →</PressLink>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-lg font-extrabold tracking-tight">More comparisons</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/ngl-alternative" className="rounded-full border-2 border-ink bg-paper px-3 py-1.5 text-sm font-semibold transition-transform hover:-translate-y-0.5">NGL alternative</Link>
            {others.map((c) => (
              <Link key={c.slug} href={`/vs/${c.slug}`} className="rounded-full border-2 border-ink bg-paper px-3 py-1.5 text-sm font-semibold transition-transform hover:-translate-y-0.5">
                vs {c.name}
              </Link>
            ))}
            <Link href="/safety" className="rounded-full border-2 border-ink bg-paper px-3 py-1.5 text-sm font-semibold transition-transform hover:-translate-y-0.5">Safety</Link>
          </div>
        </section>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </MarketingShell>
  )
}

function cell(v: true | false | string) {
  if (v === true) return <Check className="size-4 text-flame" strokeWidth={3} aria-label="Yes" />
  if (v === false) return <Minus className="size-4 text-ink-faint" aria-label="No" />
  return <span className="text-ink-soft">{v}</span>
}

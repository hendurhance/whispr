import Link from 'next/link'
import { APP_URL } from '@/configs'
import { type MarketingDoc, ALL_MARKETING, marketingHref } from '@/lib/marketing'
import { PressLink } from '@/components/landing/press-link'
import { MarketingShell } from './marketing-shell'

export function MarketingDocPage({ doc }: { doc: MarketingDoc }) {
  const related = ALL_MARKETING.filter((d) => d.slug !== doc.slug).slice(0, 4)
  const url = `${APP_URL}${marketingHref(doc)}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        mainEntity: doc.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      ...(doc.steps
        ? [
            {
              '@type': 'HowTo',
              name: doc.h1,
              step: doc.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.body })),
            },
          ]
        : []),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: APP_URL },
          { '@type': 'ListItem', position: 2, name: doc.h1, item: url },
        ],
      },
    ],
  }

  return (
    <MarketingShell>
      <main className="mx-auto max-w-3xl px-5 py-8">
        <nav aria-label="Breadcrumb" className="font-voice text-xs text-ink-faint">
          <Link href="/" className="hover:text-ink">Home</Link> <span className="px-1">/</span> <span className="text-ink">{doc.h1}</span>
        </nav>

        <p className="mt-7 font-voice text-xs uppercase tracking-[0.2em] text-flame">{doc.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl">{doc.h1}</h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">{doc.lede}</p>
        <div className="mt-7">
          <PressLink href="/auth">Get your free link →</PressLink>
        </div>

        {doc.sections.map((s) => (
          <section key={s.heading} className="mt-12">
            <h2 className="font-display text-2xl font-extrabold tracking-tight">{s.heading}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-3 leading-relaxed text-ink-soft">{p}</p>
            ))}
          </section>
        ))}

        {doc.prompts && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-extrabold tracking-tight">What people might send you</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {doc.prompts.map((p) => (
                <li key={p} className="rounded-[4px] border-2 border-ink bg-paper-2 p-4 font-voice text-sm leading-relaxed shadow-[3px_3px_0_0_var(--color-ink)]">“{p}”</li>
              ))}
            </ul>
          </section>
        )}

        {doc.steps && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-extrabold tracking-tight">How to set it up</h2>
            <ol className="mt-5 space-y-5">
              {doc.steps.map((st, i) => (
                <li key={st.title} className="flex gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-flame font-display font-extrabold text-white">{i + 1}</span>
                  <div>
                    <p className="font-display font-bold">{st.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{st.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className="mt-12">
          <h2 className="font-display text-2xl font-extrabold tracking-tight">FAQ</h2>
          <div className="mt-4 space-y-4">
            {doc.faqs.map((f) => (
              <div key={f.q} className="rounded-[4px] border-2 border-ink bg-paper-2 p-5 shadow-[3px_3px_0_0_var(--color-ink)]">
                <p className="font-display font-bold">{f.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-[4px] border-2 border-ink bg-paper-2 p-8 text-center shadow-[6px_6px_0_0_var(--color-ink)]">
          <h2 className="font-display text-3xl font-extrabold tracking-tight">Get your free link</h2>
          <p className="mx-auto mt-3 max-w-md text-ink-soft">Claim trywhispr.me/yourname and start collecting honest, anonymous messages — free, no app to install.</p>
          <div className="mt-6 flex justify-center">
            <PressLink href="/auth">Get your free link →</PressLink>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-lg font-extrabold tracking-tight">Keep exploring</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {related.map((d) => (
              <Link key={d.slug} href={marketingHref(d)} className="rounded-full border-2 border-ink bg-paper px-3 py-1.5 text-sm font-semibold transition-transform hover:-translate-y-0.5">
                {d.h1}
              </Link>
            ))}
            <Link href="/ngl-alternative" className="rounded-full border-2 border-ink bg-paper px-3 py-1.5 text-sm font-semibold transition-transform hover:-translate-y-0.5">
              NGL alternative
            </Link>
          </div>
        </section>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </MarketingShell>
  )
}

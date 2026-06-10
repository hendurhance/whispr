import Link from 'next/link'
import { APP_URL } from '@/configs'
import { type PromptPack, PROMPT_PACKS } from '@/lib/prompts'
import { PressLink } from '@/components/landing/press-link'
import { MarketingShell } from './marketing-shell'
import { CopyablePrompts } from './copyable-prompts'

export function PromptPackPage({ pack }: { pack: PromptPack }) {
  const related = pack.related.map((s) => PROMPT_PACKS[s]).filter(Boolean)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: pack.title,
        numberOfItems: pack.prompts.length,
        itemListElement: pack.prompts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: APP_URL },
          { '@type': 'ListItem', position: 2, name: 'Prompts', item: `${APP_URL}/prompts` },
          { '@type': 'ListItem', position: 3, name: pack.title, item: `${APP_URL}/prompts/${pack.slug}` },
        ],
      },
    ],
  }

  return (
    <MarketingShell>
      <main className="mx-auto max-w-3xl px-5 py-8">
        <nav aria-label="Breadcrumb" className="font-voice text-xs text-ink-faint">
          <Link href="/" className="hover:text-ink">Home</Link> <span className="px-1">/</span>{' '}
          <Link href="/prompts" className="hover:text-ink">Prompts</Link> <span className="px-1">/</span>{' '}
          <span className="text-ink">{pack.title}</span>
        </nav>

        <p className="mt-7 font-voice text-xs uppercase tracking-[0.2em] text-flame">Prompt pack · {pack.prompts.length} ideas</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl">{pack.title}</h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">{pack.intro}</p>
        <div className="mt-7">
          <PressLink href="/auth">Get your free link →</PressLink>
        </div>

        <p className="mt-12 text-sm font-semibold text-ink-soft">Tap any prompt to copy it</p>
        <CopyablePrompts prompts={pack.prompts} />

        <section className="mt-14 rounded-[4px] border-2 border-ink bg-paper-2 p-8 text-center shadow-[6px_6px_0_0_var(--color-ink)]">
          <h2 className="font-display text-3xl font-extrabold tracking-tight">Get these asked back</h2>
          <p className="mx-auto mt-3 max-w-md text-ink-soft">Claim your free Whispr link, post it with a prompt, and let the answers roll in — anonymously.</p>
          <div className="mt-6 flex justify-center">
            <PressLink href="/auth">Get your free link →</PressLink>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-lg font-extrabold tracking-tight">More prompt packs</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {related.map((p) => (
              <Link key={p.slug} href={`/prompts/${p.slug}`} className="rounded-full border-2 border-ink bg-paper px-3 py-1.5 text-sm font-semibold transition-transform hover:-translate-y-0.5">
                {p.title}
              </Link>
            ))}
            <Link href="/prompts" className="rounded-full border-2 border-ink bg-paper px-3 py-1.5 text-sm font-semibold transition-transform hover:-translate-y-0.5">
              All packs
            </Link>
          </div>
        </section>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </MarketingShell>
  )
}

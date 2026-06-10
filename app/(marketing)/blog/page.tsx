import type { Metadata } from 'next'
import Link from 'next/link'
import { ALL_BLOG_POSTS } from '@/lib/blog'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { PressLink } from '@/components/landing/press-link'

export const metadata: Metadata = {
  title: 'Whispr Blog — Guides on Anonymous Messaging & Q&A',
  description:
    'Guides on anonymous messaging: how to set up an anonymous Q&A, get honest feedback, and stay safe. Practical, no-fluff articles from Whispr.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Whispr Blog — Guides on Anonymous Messaging',
    description: 'Practical guides on anonymous messaging and Q&A.',
    url: '/blog',
  },
}

const DATE_FMT = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

export default function Page() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-3xl px-5 py-8">
        <nav aria-label="Breadcrumb" className="font-voice text-xs text-ink-faint">
          <Link href="/" className="hover:text-ink">Home</Link> <span className="px-1">/</span> <span className="text-ink">Blog</span>
        </nav>

        <p className="mt-7 font-voice text-xs uppercase tracking-[0.2em] text-flame">The blog</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl">Guides on anonymous messaging</h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">
          Practical, no-fluff guides on setting up an anonymous Q&amp;A, getting honest feedback, and staying safe — plus the occasional look at why anonymity works.
        </p>

        <div className="mt-10 space-y-4">
          {ALL_BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-[4px] border-2 border-ink bg-paper-2 p-6 shadow-[4px_4px_0_0_var(--color-ink)] transition-transform hover:-translate-y-0.5"
            >
              <p className="font-voice text-[11px] uppercase tracking-[0.15em] text-ink-faint">
                {DATE_FMT.format(new Date(post.datePublished))} · {post.readMinutes} min read
              </p>
              <h2 className="mt-1.5 font-display text-xl font-extrabold tracking-tight text-ink">{post.title}</h2>
              <p className="mt-2 leading-relaxed text-ink-soft">{post.excerpt}</p>
              <span className="mt-3 inline-block font-display text-sm font-bold text-flame">Read →</span>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <PressLink href="/auth">Get your free link →</PressLink>
        </div>
      </main>
    </MarketingShell>
  )
}

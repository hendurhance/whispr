import Link from 'next/link'
import type { ReactNode } from 'react'
import { APP_URL } from '@/configs'
import { type BlogPost, BLOG_POSTS } from '@/lib/blog'
import { PressLink } from '@/components/landing/press-link'
import { MarketingShell } from './marketing-shell'

const DATE_FMT = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

export function BlogPostPage({ post }: { post: BlogPost }) {
  const url = `${APP_URL}/blog/${post.slug}`
  const related = post.related.map((s) => BLOG_POSTS[s]).filter(Boolean)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.datePublished,
        dateModified: post.dateModified || post.datePublished,
        author: { '@type': 'Organization', name: 'Whispr', url: APP_URL },
        publisher: { '@type': 'Organization', name: 'Whispr', logo: { '@type': 'ImageObject', url: `${APP_URL}/icons/favicon.svg` } },
        mainEntityOfPage: url,
        url,
      },
      ...(post.faqs?.length
        ? [{ '@type': 'FAQPage', mainEntity: post.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }]
        : []),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: APP_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${APP_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  }

  return (
    <MarketingShell>
      <main className="mx-auto max-w-2xl px-5 py-8">
        <nav aria-label="Breadcrumb" className="font-voice text-xs text-ink-faint">
          <Link href="/" className="hover:text-ink">Home</Link> <span className="px-1">/</span>{' '}
          <Link href="/blog" className="hover:text-ink">Blog</Link> <span className="px-1">/</span>{' '}
          <span className="text-ink">Article</span>
        </nav>

        <p className="mt-7 font-voice text-xs uppercase tracking-[0.2em] text-flame">
          Guide · {DATE_FMT.format(new Date(post.datePublished))} · {post.readMinutes} min read
        </p>
        <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl">{post.title}</h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">{post.excerpt}</p>

        <article className="mt-10">
          {post.sections.map((s) => (
            <section key={s.heading} className="mt-9 first:mt-0">
              <h2 className="font-display text-2xl font-extrabold tracking-tight">{s.heading}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-3 leading-relaxed text-ink-soft">{renderInline(p)}</p>
              ))}
            </section>
          ))}
        </article>

        {post.faqs && post.faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-extrabold tracking-tight">FAQ</h2>
            <div className="mt-4 space-y-4">
              {post.faqs.map((f) => (
                <div key={f.q} className="rounded-[4px] border-2 border-ink bg-paper-2 p-5 shadow-[3px_3px_0_0_var(--color-ink)]">
                  <p className="font-display font-bold">{f.q}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-14 rounded-[4px] border-2 border-ink bg-paper-2 p-8 text-center shadow-[6px_6px_0_0_var(--color-ink)]">
          <h2 className="font-display text-2xl font-extrabold tracking-tight">Try it yourself</h2>
          <p className="mx-auto mt-3 max-w-md text-ink-soft">Claim a free Whispr link and start collecting honest, anonymous messages.</p>
          <div className="mt-6 flex justify-center">
            <PressLink href="/auth">Get your free link →</PressLink>
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-lg font-extrabold tracking-tight">Keep reading</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {related.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="rounded-full border-2 border-ink bg-paper px-3 py-1.5 text-sm font-semibold transition-transform hover:-translate-y-0.5">
                  {p.title}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </MarketingShell>
  )
}

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-ink">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="rounded bg-paper-sink px-1.5 py-0.5 font-voice text-[0.9em] text-ink">{part.slice(1, -1)}</code>
    }
    return part
  })
}

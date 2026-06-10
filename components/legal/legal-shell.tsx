import type { ReactNode } from 'react'
import Link from 'next/link'
import { WhisprLogo } from '@/components/brand/whispr-mark'

export function LegalShell({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div data-tier="press" className="relative min-h-[100dvh] bg-paper text-ink">
      <div className="press-grain" />
      <div className="relative z-10">
        <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5">
          <Link href="/" aria-label="Whispr home">
            <WhisprLogo markSize={24} />
          </Link>
          <Link href="/" className="font-voice text-xs text-ink-faint underline-offset-4 hover:text-ink hover:underline">
            ← home
          </Link>
        </header>

        <main className="mx-auto max-w-3xl px-5 py-8">
          <h1 className="font-display text-4xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-2 font-voice text-xs text-ink-faint">Last updated {updated}</p>
          <div className="mt-8 space-y-8">{children}</div>
          <div className="mt-12">
            <Link
              href="/"
              className="inline-block rounded-[3px] border-2 border-ink bg-flame px-5 py-2.5 font-display font-extrabold text-white shadow-[4px_4px_0_0_var(--color-ink)] transition-[transform,box-shadow] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Return home
            </Link>
          </div>
        </main>

        <footer className="mt-8 border-t-2 border-ink">
          <div className="mx-auto max-w-3xl px-5 py-6 font-voice text-[11px] text-ink-faint">© Whispr · open-source anonymous message</div>
        </footer>
      </div>
    </div>
  )
}

export function Sec({ children }: { children: ReactNode }) {
  return <section className="space-y-3">{children}</section>
}
export function H2({ children }: { children: ReactNode }) {
  return <h2 className="font-display text-xl font-extrabold tracking-tight text-ink">{children}</h2>
}
export function H3({ children }: { children: ReactNode }) {
  return <h3 className="pt-1 font-display text-base font-bold text-ink">{children}</h3>
}
export function P({ children }: { children: ReactNode }) {
  return <p className="leading-relaxed text-ink-soft">{children}</p>
}
export function UL({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-1.5 pl-6 leading-relaxed text-ink-soft marker:text-flame">{children}</ul>
}

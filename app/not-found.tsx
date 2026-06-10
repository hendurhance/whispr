import type { Metadata } from 'next'
import Link from 'next/link'
import { WhisprLogo } from '@/components/brand/whispr-mark'

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist',
}

export default function NotFound() {
  return (
    <div data-tier="press" className="relative flex min-h-[100dvh] flex-col items-center justify-center bg-paper px-6 text-center text-ink">
      <div className="press-grain" />
      <div className="relative z-10">
        <div className="flex justify-center">
          <WhisprLogo markSize={28} />
        </div>
        <p className="mt-8 font-display text-7xl font-extrabold tracking-tight">404</p>
        <p className="mt-2 text-ink-soft">This page slipped into the void.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-[3px] border-2 border-ink bg-flame px-5 py-2.5 font-display font-extrabold text-white shadow-[4px_4px_0_0_var(--color-ink)] transition-[transform,box-shadow] active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}

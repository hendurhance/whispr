import type { ReactNode } from 'react'
import Link from 'next/link'
import { WhisprLogo } from '@/components/brand/whispr-mark'
import { SiteFooter } from '@/components/site-footer'
import { PressLink } from '@/components/landing/press-link'

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div data-tier="press" className="relative min-h-[100dvh] bg-paper text-ink">
      <div className="press-grain" />
      <div className="relative z-10">
        <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5">
          <Link href="/" aria-label="Whispr home">
            <WhisprLogo markSize={26} />
          </Link>
          <PressLink href="/auth" className="px-4 py-2 text-sm">
            Get your link
          </PressLink>
        </header>

        {children}

        <SiteFooter className="max-w-3xl" />
      </div>
    </div>
  )
}

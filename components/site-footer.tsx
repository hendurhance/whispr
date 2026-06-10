import Link from 'next/link'
import { cn } from '@/lib/utils'
import { WhisprLogo } from '@/components/brand/whispr-mark'

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className="border-t-2 border-ink">
      <div className={cn('mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row', className)}>
        <WhisprLogo markSize={22} />
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-voice text-xs text-ink-faint">
          <Link href="/blog" className="hover:text-ink">Blog</Link>
          <Link href="/prompts" className="hover:text-ink">Prompts</Link>
          <Link href="/safety" className="hover:text-ink">Safety</Link>
          <Link href="/privacy" className="hover:text-ink">Privacy</Link>
          <Link href="/terms" className="hover:text-ink">Terms</Link>
          <a href="https://github.com/hendurhance/whispr" target="_blank" rel="noopener noreferrer" className="hover:text-ink">GitHub</a>
        </div>
        <p className="font-voice text-[11px] text-ink-faint">open-source anonymous message</p>
      </div>
    </footer>
  )
}

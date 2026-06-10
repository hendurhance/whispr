import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function PressLink({
  href,
  children,
  variant = 'flame',
  className,
}: {
  href: string
  children: ReactNode
  variant?: 'flame' | 'paper' | 'ink'
  className?: string
}) {
  const bg = variant === 'ink' ? 'bg-ink text-paper' : variant === 'paper' ? 'bg-paper text-ink' : 'bg-flame text-white'
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[3px] border-2 border-ink px-5 py-3 font-display text-base font-extrabold shadow-[5px_5px_0_0_var(--color-ink)] transition-[transform,box-shadow] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none',
        bg,
        className,
      )}
    >
      {children}
    </Link>
  )
}

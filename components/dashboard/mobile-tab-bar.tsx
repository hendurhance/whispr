'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Inbox, Link2, BarChart3, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/dashboard', label: 'Inbox', icon: Inbox },
  { href: '/profile', label: 'Link', icon: Link2 },
  { href: '/stats', label: 'Stats', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function MobileTabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-paper/95 backdrop-blur lg:hidden">
      {TABS.map((t) => {
        const active = pathname === t.href || pathname.startsWith(`${t.href}/`)
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors',
              active ? 'text-flame-ink' : 'text-ink-faint hover:text-ink',
            )}
          >
            <t.icon className="size-5" />
            {t.label}
          </Link>
        )
      })}
    </nav>
  )
}

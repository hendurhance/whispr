'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Inbox, Link2, BarChart3, Settings, LogOut, Copy } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { signOutUser } from '@/lib/client/auth'
import { WhisprLogo } from '@/components/brand/whispr-mark'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'

interface DashboardSidebarProps {
  username: string
  displayName: string
  avatarUrl?: string
  profileUrl: string
  unreadCount: number
}

const NAV = [
  { href: '/dashboard', label: 'Inbox', icon: Inbox },
  { href: '/profile', label: 'Your link', icon: Link2 },
  { href: '/stats', label: 'Stats', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function DashboardSidebar({ username, displayName, avatarUrl, profileUrl, unreadCount }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://${profileUrl}`)
      toast.success('Link copied')
    } catch {
      toast.error('Could not copy')
    }
  }

  const logout = async () => {
    await signOutUser()
    router.push('/auth')
  }

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-paper p-3.5 lg:flex">
      <div className="px-2 py-2 pb-4">
        <WhisprLogo markSize={24} />
      </div>

      <nav className="flex flex-col gap-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex min-h-10 items-center gap-3 rounded-md px-2.5 text-sm font-medium transition-colors',
                active ? 'bg-flame/10 text-flame-ink' : 'text-ink-soft hover:bg-secondary hover:text-ink',
              )}
            >
              <Icon className="size-[18px] shrink-0" />
              {label}
              {label === 'Inbox' && unreadCount > 0 && (
                <span className="ml-auto rounded-full bg-flame px-1.5 py-0.5 font-voice text-[11px] font-semibold leading-none text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto">
        <div className="flex items-center gap-2.5 rounded-md border border-border bg-paper p-2.5">
          {avatarUrl ? (
            <Avatar src={avatarUrl} size={32} className="size-8 shrink-0 rounded-full object-cover" />
          ) : (
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-paper">
              {(displayName || username).charAt(0).toUpperCase()}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-ink">@{username}</p>
            <p className="truncate font-voice text-[10.5px] text-ink-faint">{profileUrl}</p>
          </div>
          <button
            onClick={copyLink}
            title="Copy link"
            className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-secondary text-ink-faint transition-colors hover:text-ink"
          >
            <Copy className="size-3.5" />
          </button>
        </div>
        <button
          onClick={logout}
          className="mt-2 flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium text-ink-faint transition-colors hover:bg-secondary hover:text-ink"
        >
          <LogOut className="size-[18px]" /> Log out
        </button>
      </div>
    </aside>
  )
}

'use client'

import { toast } from 'react-hot-toast'
import { Copy } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types'
import type { WhisprStats } from '@/types/whispr'
import { APP_URL_CLEAN } from '@/configs'
import { Button } from '@/components/ui/button'
import { AppShell } from './app-shell'

interface StatsViewProps {
  user: User
  profile: Profile | null
  stats: WhisprStats
  recentDates: string[]
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function StatsView({ user, profile, stats, recentDates }: StatsViewProps) {
  const username = profile?.username || (user.user_metadata?.username as string) || 'user'
  const displayName = profile?.display_name || username
  const avatarUrl = profile?.avatar_url || (user.user_metadata?.avatar_url as string) || ''
  const profileUrl = `${APP_URL_CLEAN}/${username}`
  const unread = stats.unread

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    return { label: DAY_LABELS[d.getDay()], key: d.toDateString(), count: 0 }
  })
  for (const createdAt of recentDates) {
    const d = new Date(createdAt)
    d.setHours(0, 0, 0, 0)
    const bucket = days.find((x) => x.key === d.toDateString())
    if (bucket) bucket.count++
  }
  const max = Math.max(...days.map((d) => d.count), 1)
  const weekTotal = days.reduce((a, d) => a + d.count, 0)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://${profileUrl}`)
      toast.success('Link copied')
    } catch {
      toast.error('Could not copy')
    }
  }

  return (
    <AppShell username={username} displayName={displayName} avatarUrl={avatarUrl} profileUrl={profileUrl} unreadCount={unread}>
      <header className="border-b border-border px-5 py-3.5">
        <h1 className="font-display text-xl font-bold tracking-tight text-ink">Stats</h1>
      </header>

      <div className="mx-auto w-full max-w-4xl px-5 py-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Total whisprs" value={stats.total} />
          <StatTile label="Unread" value={unread} />
          <StatTile label="Profile views" value={profile?.total_views ?? 0} />
          <StatTile label="This week" value={weekTotal} />
        </div>

        <div className="mt-6 rounded-xl border border-border bg-paper p-5 shadow-sm">
          <h2 className="font-display text-base font-bold text-ink">Whisprs · last 7 days</h2>
          {weekTotal === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <p className="text-sm text-ink-faint">No whisprs in the last 7 days yet. Share your link to get some.</p>
              <Button variant="flame" className="mt-4" onClick={copyLink}>
                <Copy /> Copy your link
              </Button>
            </div>
          ) : (
            <div className="mt-6 flex h-44 gap-3">
              {days.map((d, i) => (
                <div key={i} className="flex h-full flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t bg-flame/80"
                      style={{ height: `${Math.max((d.count / max) * 100, d.count > 0 ? 6 : 2)}%` }}
                      title={`${d.count} whispr${d.count === 1 ? '' : 's'}`}
                    />
                  </div>
                  <span className="font-voice text-xs text-ink-faint">{d.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-paper p-4">
      <p className="text-xs font-medium text-ink-faint">{label}</p>
      <p className="mt-1.5 font-display text-2xl font-bold tracking-tight text-ink tabular-nums">{value.toLocaleString()}</p>
    </div>
  )
}

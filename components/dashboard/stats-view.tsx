'use client'

import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types'
import { APP_URL_CLEAN } from '@/configs'
import { AppShell } from './app-shell'

interface StatsViewProps {
  user: User
  profile: Profile | null
  whisprs: Array<{ is_read: boolean; created_at?: string }>
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function StatsView({ user, profile, whisprs }: StatsViewProps) {
  const username = profile?.username || (user.user_metadata?.username as string) || 'user'
  const displayName = profile?.display_name || username
  const avatarUrl = profile?.avatar_url || (user.user_metadata?.avatar_url as string) || ''
  const profileUrl = `${APP_URL_CLEAN}/${username}`
  const unread = whisprs.filter((w) => !w.is_read).length

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    return { label: DAY_LABELS[d.getDay()], key: d.toDateString(), count: 0 }
  })
  for (const w of whisprs) {
    if (!w.created_at) continue
    const d = new Date(w.created_at)
    d.setHours(0, 0, 0, 0)
    const bucket = days.find((x) => x.key === d.toDateString())
    if (bucket) bucket.count++
  }
  const max = Math.max(...days.map((d) => d.count), 1)
  const weekTotal = days.reduce((a, d) => a + d.count, 0)

  return (
    <AppShell username={username} displayName={displayName} avatarUrl={avatarUrl} profileUrl={profileUrl} unreadCount={unread}>
      <header className="border-b border-border px-5 py-3.5">
        <h1 className="font-display text-xl font-bold tracking-tight text-ink">Stats</h1>
      </header>

      <div className="mx-auto w-full max-w-4xl px-5 py-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Total whisprs" value={whisprs.length} />
          <StatTile label="Unread" value={unread} />
          <StatTile label="Profile views" value={profile?.total_views ?? 0} />
          <StatTile label="This week" value={weekTotal} />
        </div>

        <div className="mt-6 rounded-xl border border-border bg-paper p-5 shadow-sm">
          <p className="text-sm font-semibold text-ink">Whisprs · last 7 days</p>
          {weekTotal === 0 ? (
            <p className="py-10 text-center text-sm text-ink-faint">No whisprs in the last 7 days yet.</p>
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
                  <span className="font-voice text-[11px] text-ink-faint">{d.label}</span>
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

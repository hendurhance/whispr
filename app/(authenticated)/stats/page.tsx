import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUserSession, getProfileData, getInboxSummary, getWhisprDatesSince } from '@/lib/server/profile-data'
import { StatsView } from '@/components/dashboard/stats-view'

export const metadata: Metadata = {
  title: 'Stats',
  robots: { index: false, follow: false },
}

export const revalidate = 60

// 8 days, not 7: the chart buckets by the viewer's local day, which can start up to a day before UTC.
const RECENT_WINDOW_MS = 8 * 24 * 60 * 60 * 1000

export default async function StatsRoute() {
  const user = await getUserSession()

  if (!user) {
    redirect('/auth')
  }

  const since = new Date(Date.now() - RECENT_WINDOW_MS).toISOString()
  const [stats, recentDates, profile] = await Promise.all([
    getInboxSummary(),
    getWhisprDatesSince(user.id, since),
    getProfileData(),
  ])

  return <StatsView user={user} profile={profile} stats={stats} recentDates={recentDates} />
}

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getWhisprsData, getProfileData } from '@/lib/server/profile-data'
import { StatsView } from '@/components/dashboard/stats-view'

export const metadata: Metadata = {
  title: 'Stats',
  robots: { index: false, follow: false },
}

export const revalidate = 60

export default async function StatsRoute() {
  const { whisprs, user } = await getWhisprsData()
  const profile = await getProfileData()

  if (!user) {
    redirect('/auth')
  }

  return <StatsView user={user} profile={profile} whisprs={whisprs} />
}

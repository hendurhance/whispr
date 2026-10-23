import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUserSession, getProfileData, getInboxSummary } from '@/lib/server/profile-data'
import { YourLinkView } from '@/components/profile/your-link-view'

export const metadata: Metadata = {
  title: 'Your link',
  description: 'Share your link and manage your social links',
  robots: { index: false, follow: false },
}

export const revalidate = 60

export default async function ProfileRoute() {
  const user = await getUserSession()

  if (!user) {
    redirect('/auth')
  }

  const [stats, profile] = await Promise.all([getInboxSummary(), getProfileData()])

  return <YourLinkView initialUser={user} initialProfile={profile} unreadCount={stats.unread} />
}

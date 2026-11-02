import type { Metadata } from 'next'
import { requireProfile, getInboxSummary } from '@/lib/server/profile-data'
import { YourLinkView } from '@/components/profile/your-link-view'

export const metadata: Metadata = {
  title: 'Your link',
  description: 'Share your link and manage your social links',
  robots: { index: false, follow: false },
}

export const revalidate = 60

export default async function ProfileRoute() {
  const { user, profile } = await requireProfile()
  const stats = await getInboxSummary()

  return <YourLinkView initialUser={user} initialProfile={profile} unreadCount={stats.unread} />
}

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getWhisprsData, getProfileData } from '@/lib/server/profile-data'
import { YourLinkView } from '@/components/profile/your-link-view'

export const metadata: Metadata = {
  title: 'Your link',
  description: 'Share your link and manage your social links',
  robots: { index: false, follow: false },
}

export const revalidate = 60

export default async function ProfileRoute() {
  const { whisprs, user } = await getWhisprsData()
  const profile = await getProfileData()

  if (!user) {
    redirect('/auth')
  }

  const unread = (whisprs as Array<{ is_read: boolean }>).filter((w) => !w.is_read).length

  return <YourLinkView initialUser={user} initialProfile={profile} unreadCount={unread} />
}

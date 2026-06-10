import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getWhisprsData, getProfileData } from '@/lib/server/profile-data'
import { SettingsView } from '@/components/settings/settings-view'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account settings and preferences',
  robots: { index: false, follow: false },
}

export const revalidate = 60

export default async function SettingsRoute() {
  const { whisprs, user } = await getWhisprsData()
  const profile = await getProfileData()

  if (!user) {
    redirect('/auth')
  }

  const unread = (whisprs as Array<{ is_read: boolean }>).filter((w) => !w.is_read).length

  return <SettingsView initialUser={user} initialProfile={profile} unreadCount={unread} />
}

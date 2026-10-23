import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUserSession, getProfileData, getInboxSummary } from '@/lib/server/profile-data'
import { SettingsView } from '@/components/settings/settings-view'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account settings and preferences',
  robots: { index: false, follow: false },
}

export const revalidate = 60

export default async function SettingsRoute() {
  const user = await getUserSession()

  if (!user) {
    redirect('/auth')
  }

  const [stats, profile] = await Promise.all([getInboxSummary(), getProfileData()])

  return <SettingsView initialUser={user} initialProfile={profile} unreadCount={stats.unread} />
}

import type { Metadata } from 'next'
import { requireProfile, getInboxSummary } from '@/lib/server/profile-data'
import { SettingsView } from '@/components/settings/settings-view'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account settings and preferences',
  robots: { index: false, follow: false },
}

export const revalidate = 60

export default async function SettingsRoute() {
  const { user, profile } = await requireProfile()
  const stats = await getInboxSummary()

  return <SettingsView initialUser={user} initialProfile={profile} unreadCount={stats.unread} />
}

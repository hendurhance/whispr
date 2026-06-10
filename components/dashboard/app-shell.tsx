'use client'

import type { ReactNode } from 'react'
import { AppBadge } from '@/components/pwa/app-badge'
import { DashboardSidebar } from './dashboard-sidebar'
import { MobileTabBar } from './mobile-tab-bar'

interface AppShellProps {
  username: string
  displayName: string
  avatarUrl?: string
  profileUrl: string
  unreadCount: number
  children: ReactNode
}

export function AppShell({ username, displayName, avatarUrl, profileUrl, unreadCount, children }: AppShellProps) {
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background text-foreground">
      <DashboardSidebar
        username={username}
        displayName={displayName}
        avatarUrl={avatarUrl}
        profileUrl={profileUrl}
        unreadCount={unreadCount}
      />
      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto pb-20 lg:pb-0">{children}</main>
      <MobileTabBar />
      <AppBadge count={unreadCount} />
    </div>
  )
}

'use client'

import { useEffect } from 'react'

type BadgeNavigator = Navigator & {
  setAppBadge?: (count?: number) => Promise<unknown>
  clearAppBadge?: () => Promise<unknown>
}

export function AppBadge({ count }: { count: number }) {
  useEffect(() => {
    const nav = navigator as BadgeNavigator
    if (count > 0) nav.setAppBadge?.(count).catch(() => {})
    else nav.clearAppBadge?.().catch(() => {})
  }, [count])
  return null
}

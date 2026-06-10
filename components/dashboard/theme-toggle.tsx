'use client'

import { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'

export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.getAttribute('data-appearance') === 'dark')
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.setAttribute('data-appearance', next ? 'dark' : 'light')
    try {
      localStorage.setItem('desk-theme', next ? 'dark' : 'light')
    } catch {}
  }

  return (
    <section className="rounded-xl border border-border bg-paper p-5 shadow-sm">
      <p className="text-sm font-semibold text-ink">Appearance</p>
      <div className="mt-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ink">Dark mode</p>
          <p className="text-xs text-ink-faint">Use a dark theme for your dashboard.</p>
        </div>
        <Switch checked={dark} onCheckedChange={toggle} aria-label="Toggle dark mode" />
      </div>
    </section>
  )
}

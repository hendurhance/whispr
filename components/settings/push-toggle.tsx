'use client'

import { useEffect, useState } from 'react'
import { Bell, BellOff, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { isPushSupported, getPushSubscribed, subscribeToPush, unsubscribeFromPush } from '@/lib/client/push'

export function PushToggle() {
  const [supported, setSupported] = useState(true)
  const [enabled, setEnabled] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!isPushSupported()) {
      setSupported(false)
      return
    }
    getPushSubscribed().then(setEnabled)
  }, [])

  const toggle = async () => {
    setBusy(true)
    try {
      if (enabled) {
        await unsubscribeFromPush()
        setEnabled(false)
        toast.success('Push notifications turned off')
      } else {
        const { ok, error } = await subscribeToPush()
        if (ok) {
          setEnabled(true)
          toast.success('You’ll get a ping on new whisprs')
        } else {
          toast.error(error || 'Could not enable notifications')
        }
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-paper p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">Push notifications</p>
          <p className="mt-1 text-sm text-ink-faint">
            {supported
              ? 'Get a notification on this device when a new whispr lands — even when Whispr is closed.'
              : 'This browser doesn’t support push notifications. Try installing Whispr to your home screen.'}
          </p>
        </div>
        {supported && (
          <button
            onClick={toggle}
            disabled={busy}
            className="inline-flex shrink-0 items-center gap-2 rounded-md border border-border bg-paper px-3.5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-secondary disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : enabled ? (
              <BellOff className="size-4" />
            ) : (
              <Bell className="size-4" />
            )}
            {enabled ? 'Turn off' : 'Turn on'}
          </button>
        )}
      </div>
    </div>
  )
}

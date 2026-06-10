'use client'

import { useEffect, useState } from 'react'
import { Flag } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

const REASONS = [
  { value: 'spam', label: 'Spam or scam' },
  { value: 'harassment', label: 'Harassment or bullying' },
  { value: 'hate', label: 'Hate or violence' },
  { value: 'sexual', label: 'Sexual or explicit' },
  { value: 'other', label: 'Something else' },
] as const

interface ReportDialogProps {
  open: boolean
  busy?: boolean
  onConfirm: (reason: string) => void
  onCancel: () => void
}

export function ReportDialog({ open, busy, onConfirm, onCancel }: ReportDialogProps) {
  const [reason, setReason] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setReason(null)
      return
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-black/50" onClick={onCancel} aria-label="Cancel" tabIndex={-1} />
      <div className="relative w-full max-w-sm rounded-xl border border-border bg-paper p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ember/10 text-ember">
            <Flag className="size-5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-base font-bold text-ink">Report this whispr</h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">It’ll be removed from your inbox and sent to us to review. Why are you reporting it?</p>
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          {REASONS.map((r) => (
            <button
              key={r.value}
              onClick={() => setReason(r.value)}
              className={cn(
                'flex w-full items-center rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors',
                reason === r.value ? 'border-ember bg-ember/10 text-ink' : 'border-border bg-paper text-ink-soft hover:bg-secondary',
              )}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={() => reason && onConfirm(reason)} disabled={busy || !reason}>
            Report
          </Button>
        </div>
      </div>
    </div>
  )
}

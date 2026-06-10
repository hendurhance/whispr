'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from './button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ open, title, description, confirmLabel = 'Delete', cancelLabel = 'Cancel', busy, onConfirm, onCancel }: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return
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
            <AlertTriangle className="size-5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-base font-bold text-ink">{title}</h2>
            {description && <p className="mt-1 text-sm leading-relaxed text-ink-soft">{description}</p>}
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button variant="destructive" size="sm" onClick={onConfirm} disabled={busy}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

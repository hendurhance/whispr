'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Download, Share2, Check, Trash2, Copy, Flag, ImageDown, Loader2 } from 'lucide-react'
import { type Whispr, formatDate } from '@/types/whispr'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { WhisprTypeBadge } from './whispr-type-badge'

type CardFormat = 'square' | 'story'

interface ShareStudioProps {
  whispr: Whispr | null
  handle: string
  accent: string
  mode: string
  busy?: boolean
  onDownload: (whispr: Whispr, format: CardFormat) => void
  onShare: (whispr: Whispr, format: CardFormat) => void
  onMarkRead: (whispr: Whispr) => void
  onDelete: (whispr: Whispr) => void
  onReport: (whispr: Whispr) => void
}

export function ShareStudio({ whispr, handle, accent, mode, busy, onDownload, onShare, onMarkRead, onDelete, onReport }: ShareStudioProps) {
  const [format, setFormat] = useState<CardFormat>('square')
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const [pending, setPending] = useState<'share' | 'download' | null>(null)

  if (!whispr) {
    return (
      <div className="flex h-full min-h-[20rem] flex-col items-center justify-center px-6 text-center">
        <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-secondary">
          <ImageDown className="size-5 text-ink-faint" />
        </div>
        <p className="font-display text-sm font-semibold text-ink">Share studio</p>
        <p className="mt-1 max-w-[15rem] text-xs text-ink-faint">Select a whispr to turn it into a share card for your story.</p>
      </div>
    )
  }

  const cardSrc = `/og/whispr?content=${encodeURIComponent(whispr.content)}&type=${whispr.type}&handle=${encodeURIComponent(handle)}&format=${format}&accent=${encodeURIComponent(accent)}&mode=${encodeURIComponent(mode)}`
  const isLoading = loadedSrc !== cardSrc

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(whispr.content)
      toast.success('Text copied')
    } catch {
      toast.error('Could not copy')
    }
  }
  return (
    <div className="flex flex-col gap-5 p-5">
      <p className="font-display text-xs font-semibold uppercase tracking-wide text-ink-faint">Share studio</p>

      <div className="rounded-lg border border-border bg-paper-sink/60 p-4">
        <WhisprTypeBadge type={whispr.type} className="mb-3" />
        <p className="font-voice text-sm leading-relaxed text-ink">{whispr.content}</p>
        <p className="mt-3 font-voice text-xs text-ink-faint">received {formatDate(whispr.createdAt)} · anonymous</p>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-ink-soft">Make a share card</p>
        <div className="relative flex min-h-[280px] items-center justify-center rounded-lg border border-border bg-paper-sink/50 p-3">
          {isLoading && (
            <div className="absolute inset-3 z-10 flex animate-pulse flex-col items-center justify-center gap-2 rounded-[3px] border border-border bg-secondary text-ink-faint">
              <Loader2 className="size-5 animate-spin" />
              <span className="font-voice text-xs">rendering card…</span>
            </div>
          )}
          <img
            key={cardSrc}
            src={cardSrc}
            alt="Share card preview"
            loading="lazy"
            onLoad={() => setLoadedSrc(cardSrc)}
            onError={() => setLoadedSrc(cardSrc)}
            className={cn(
              'w-full rounded-[3px] border-2 border-ink object-contain shadow-[4px_4px_0_var(--color-ink)] transition-opacity duration-300',
              isLoading && 'opacity-0',
              format === 'story' && 'mx-auto max-h-72 w-auto',
            )}
          />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(['square', 'story'] as CardFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={cn(
                'rounded-md border px-3 py-2 text-xs font-semibold transition-colors',
                format === f ? 'border-flame bg-flame/10 text-flame-ink' : 'border-border bg-paper text-ink-faint hover:bg-secondary hover:text-ink',
              )}
            >
              {f === 'square' ? 'Square 1:1' : 'Story 9:16'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button variant="flame" disabled={busy} onClick={() => { setPending('share'); onShare(whispr, format) }}>
          <Share2 /> {busy && pending === 'share' ? 'Preparing…' : 'Share to story'}
        </Button>
        <Button variant="outline" disabled={busy} onClick={() => { setPending('download'); onDownload(whispr, format) }}>
          <Download /> {busy && pending === 'download' ? 'Preparing…' : 'Download PNG'}
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5 border-t border-border pt-4">
        <Button variant="ghost" size="sm" onClick={copyText}>
          <Copy /> Copy text
        </Button>
        {!whispr.isRead && (
          <Button variant="ghost" size="sm" onClick={() => onMarkRead(whispr)}>
            <Check /> Mark read
          </Button>
        )}
        <Button variant="ghost" size="sm" className="text-ember-ink hover:text-ember-ink" onClick={() => onDelete(whispr)}>
          <Trash2 /> Delete
        </Button>
        <Button variant="ghost" size="sm" className="text-ember-ink hover:text-ember-ink" onClick={() => onReport(whispr)}>
          <Flag /> Report
        </Button>
      </div>

      <p className="text-xs leading-relaxed text-ink-faint">Whispr never posts for you — share the card, then reply on your story.</p>
    </div>
  )
}

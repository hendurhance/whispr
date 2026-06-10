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

const PLATFORMS = [
  {
    label: 'Instagram',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  {
    label: 'TikTok',
    path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  },
  {
    label: 'X',
    path: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.931ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
  },
]

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
      <p className="font-display text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Share studio</p>

      <div className="rounded-lg border border-border bg-paper-sink/60 p-4">
        <WhisprTypeBadge type={whispr.type} className="mb-3" />
        <p className="font-voice text-sm leading-relaxed text-ink">{whispr.content}</p>
        <p className="mt-3 font-voice text-[11px] text-ink-faint">received {formatDate(whispr.createdAt)} · anonymous</p>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-ink-soft">Make a share card</p>
        <div className="relative flex min-h-[280px] items-center justify-center rounded-lg border border-border bg-paper-sink/50 p-3">
          {isLoading && (
            <div className="absolute inset-3 z-10 flex animate-pulse flex-col items-center justify-center gap-2 rounded-[3px] border border-border bg-secondary text-ink-faint">
              <Loader2 className="size-5 animate-spin" />
              <span className="font-voice text-[11px]">rendering card…</span>
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

      <div>
        <p className="mb-2 text-xs font-semibold text-ink-soft">Share to</p>
        <div className="flex gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p.label}
              title={`Share to ${p.label}`}
              aria-label={`Share to ${p.label}`}
              disabled={busy}
              onClick={() => { setPending('share'); onShare(whispr, 'story') }}
              className="flex size-10 items-center justify-center rounded-md border border-border bg-paper text-ink transition-colors hover:bg-secondary disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]" aria-hidden="true">
                <path d={p.path} />
              </svg>
            </button>
          ))}
        </div>
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
        <Button variant="ghost" size="sm" className="text-ember hover:text-ember" onClick={() => onDelete(whispr)}>
          <Trash2 /> Delete
        </Button>
        <Button variant="ghost" size="sm" className="text-ember hover:text-ember" onClick={() => onReport(whispr)}>
          <Flag /> Report
        </Button>
      </div>

      <p className="text-[11px] leading-relaxed text-ink-faint">Whispr never posts for you — share the card, then reply on your story.</p>
    </div>
  )
}

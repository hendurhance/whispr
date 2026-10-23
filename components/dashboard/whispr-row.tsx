'use client'

import { Share2, Check, Trash2, Flag } from 'lucide-react'
import { type Whispr, formatDate } from '@/types/whispr'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { WhisprTypeBadge } from './whispr-type-badge'

interface WhisprRowProps {
  whispr: Whispr
  selected: boolean
  busy?: boolean
  onSelect: (whispr: Whispr) => void
  onShare: (whispr: Whispr) => void
  onMarkRead: (whispr: Whispr) => void
  onDelete: (whispr: Whispr) => void
  onReport: (whispr: Whispr) => void
}

export function WhisprRow({ whispr, selected, busy, onSelect, onShare, onMarkRead, onDelete, onReport }: WhisprRowProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(whispr)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(whispr)
        }
      }}
      className={cn(
        'group flex cursor-pointer gap-3 border-b border-border px-4 py-3.5 text-left outline-none transition-colors last:border-b-0 hover:bg-secondary focus-visible:bg-secondary',
        selected && 'bg-flame/5 shadow-[inset_2px_0_0_var(--color-flame)]',
      )}
    >
      <div className="w-2 shrink-0 pt-1.5">
        {!whispr.isRead && <span className="block size-2 rounded-full bg-flame ring-4 ring-flame/15" aria-label="unread" />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center gap-2">
          <WhisprTypeBadge type={whispr.type} />
          <span className="ml-auto shrink-0 font-voice text-xs text-ink-faint">{formatDate(whispr.createdAt, true)}</span>
        </div>

        <p className={cn('font-voice text-[13px] leading-relaxed', whispr.isRead ? 'text-ink-faint' : 'text-ink')}>
          {whispr.content}
        </p>

        <div className="mt-2 flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-ink-faint hover:text-flame-ink pointer-coarse:size-11"
            disabled={busy}
            title="Make share card"
            aria-label="Make share card"
            onClick={() => onShare(whispr)}
          >
            <Share2 />
          </Button>
          <div className="hidden items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 pointer-fine:flex">
            {!whispr.isRead && (
              <Button variant="ghost" size="icon" className="size-8 text-ink-faint hover:text-ink" title="Mark read" aria-label="Mark read" onClick={() => onMarkRead(whispr)}>
                <Check />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="size-8 text-ink-faint hover:text-ember-ink" title="Delete" aria-label="Delete" onClick={() => onDelete(whispr)}>
              <Trash2 />
            </Button>
            <Button variant="ghost" size="icon" className="size-8 text-ink-faint hover:text-ember-ink" title="Report" aria-label="Report" onClick={() => onReport(whispr)}>
              <Flag />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

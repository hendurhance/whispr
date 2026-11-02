'use client'

import { useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Download, Share2, Check, Trash2, Copy, Flag, Loader2 } from 'lucide-react'
import { type Whispr, formatDate } from '@/types/whispr'
import { cardUrl } from '@/lib/client/share-card'
import { ANSWER_MAX_LENGTH } from '@/lib/inbox'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { WhisprTypeBadge } from './whispr-type-badge'

type CardFormat = 'square' | 'story'

interface ShareStudioProps {
  whispr: Whispr
  busy?: boolean
  onDownload: (whispr: Whispr, format: CardFormat) => void
  onShare: (whispr: Whispr, format: CardFormat) => void
  onMarkRead: (whispr: Whispr) => void
  onDelete: (whispr: Whispr) => void
  onReport: (whispr: Whispr) => void
  onSaveAnswer: (whispr: Whispr, answer: string) => Promise<boolean>
}

export function ShareStudio({ whispr, busy, onDownload, onShare, onMarkRead, onDelete, onReport, onSaveAnswer }: ShareStudioProps) {
  const [format, setFormat] = useState<CardFormat>('square')
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const [pending, setPending] = useState<'share' | 'download' | null>(null)
  const [draftAnswer, setDraftAnswer] = useState(whispr.answer ?? '')
  const [previewAnswer, setPreviewAnswer] = useState(whispr.answer ?? '')
  const savedAnswerRef = useRef(whispr.answer ?? '')

  const cardSrc = cardUrl({ ...whispr, answer: previewAnswer || null }, format)
  const isLoading = loadedSrc !== cardSrc

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(whispr.content)
      toast.success('Text copied')
    } catch {
      toast.error('Could not copy')
    }
  }

  const commitAnswer = (): Whispr => {
    const answer = draftAnswer.trim()
    setPreviewAnswer(answer)
    const previous = savedAnswerRef.current
    if (answer !== previous) {
      savedAnswerRef.current = answer
      void onSaveAnswer(whispr, answer).then((isSaved) => {
        if (!isSaved) savedAnswerRef.current = previous
      })
    }
    return { ...whispr, answer: answer || null }
  }

  const share = () => {
    setPending('share')
    onShare(commitAnswer(), format)
  }

  const download = () => {
    setPending('download')
    onDownload(commitAnswer(), format)
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
        <label htmlFor={`answer-${whispr.id}`} className="mb-2 block text-xs font-semibold text-ink-soft">
          Your answer <span className="font-normal text-ink-faint">(printed on the card)</span>
        </label>
        <textarea
          id={`answer-${whispr.id}`}
          value={draftAnswer}
          onChange={(e) => setDraftAnswer(e.target.value)}
          onBlur={commitAnswer}
          maxLength={ANSWER_MAX_LENGTH}
          rows={3}
          placeholder="Type your answer…"
          className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/35"
        />
        <p className="mt-1 text-right font-voice text-xs text-ink-faint">
          {draftAnswer.length}/{ANSWER_MAX_LENGTH}
        </p>
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
        <Button variant="flame" disabled={busy} onClick={share}>
          <Share2 /> {busy && pending === 'share' ? 'Preparing…' : 'Share to story'}
        </Button>
        <Button variant="outline" disabled={busy} onClick={download}>
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

'use client'

import { Dices } from 'lucide-react'
import { getWhisprTypeIcon, getWhisprTypeLabel, type WhisprType } from '@/types/whispr'
import { useWhisprSubmission } from '@/hooks/useWhisprSubmission'
import { submitWhispr } from '@/lib/client/whisprs'
import { cn } from '@/lib/utils'

const STICKER: Record<WhisprType, string> = {
  question: 'bg-ultra text-white',
  compliment: 'bg-spot-mint text-ink',
  roast: 'bg-ember text-ink',
  confession: 'bg-spot-grape text-white',
  rumor: 'bg-spot-sky text-ink',
  suggestion: 'bg-spot-sun text-ink',
  secret: 'bg-spot-overprint text-white',
  hot_take: 'bg-spot-pink text-ink',
  dare: 'bg-spot-lime text-ink',
}

interface SubmissionFormProps {
  username: string
  onSuccess: () => void
  onError: (error: unknown) => void
}

export function SubmissionForm({ username, onSuccess, onError }: SubmissionFormProps) {
  const {
    content,
    selectedType,
    setSelectedType,
    isSubmitting,
    charCount,
    isDiceRolling,
    typeScrollContainerRef,
    handleContentChange,
    generateSuggestion,
    handleSubmit,
    whisprTypes,
    maxChars,
  } = useWhisprSubmission({ username, onSuccess, onError: (e) => onError(e), customSubmitFunction: submitWhispr })

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[4px] border-2 border-ink bg-paper-2 p-5 shadow-[6px_6px_0_0_var(--color-ink)]"
    >
      <h2 className="font-display text-lg font-extrabold leading-tight text-ink">send me something — anonymously</h2>
      <p className="mt-1 font-voice text-[11px] text-ink-faint">to @{username}</p>

      <div
        ref={typeScrollContainerRef}
        role="radiogroup"
        aria-label="Message type"
        className="scrollbar-hide mt-4 flex gap-2 overflow-x-auto pb-2"
      >
        {whisprTypes.map((t) => {
          const Icon = getWhisprTypeIcon(t)
          const active = selectedType === t
          return (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSelectedType(t)}
              className={cn(
                'inline-flex shrink-0 items-center gap-1.5 rounded-[3px] border-2 border-ink px-3 py-1.5 text-[13px] font-semibold transition-transform',
                active ? cn(STICKER[t], 'shadow-[2px_2px_0_0_var(--color-ink)]') : 'bg-paper text-ink-soft hover:-translate-y-0.5',
              )}
            >
              <Icon className="size-3.5 shrink-0" />
              {getWhisprTypeLabel(t)}
            </button>
          )
        })}
      </div>

      <div className="relative mt-3">
        <textarea
          value={content}
          onChange={handleContentChange}
          maxLength={maxChars}
          rows={4}
          required
          placeholder={`write your anonymous ${getWhisprTypeLabel(selectedType).toLowerCase()} here…`}
          className="w-full resize-none rounded-[3px] border-2 border-ink bg-paper px-4 py-3 font-voice text-[15px] leading-relaxed text-ink outline-none placeholder:text-ink-faint focus:ring-2 focus:ring-[var(--accent)]"
        />
        <button
          type="button"
          onClick={generateSuggestion}
          disabled={isDiceRolling}
          title="Roll a random prompt"
          aria-label="Roll a random prompt"
          className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-[3px] border-2 border-ink bg-spot-sun text-ink shadow-[2px_2px_0_0_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60"
        >
          <Dices className={cn('size-5', isDiceRolling && 'animate-spin')} />
        </button>
      </div>
      <div className="mt-1 text-right font-voice text-[11px] text-ink-faint">
        {charCount}/{maxChars}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || content.trim().length === 0}
        className="mt-4 w-full rounded-[3px] border-2 border-ink bg-[var(--accent)] px-5 py-3 font-display text-base font-extrabold text-[var(--accent-fg)] shadow-[5px_5px_0_0_var(--color-ink)] transition-[transform,box-shadow] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-[3px_3px_0_0_var(--color-ink)]"
      >
        {isSubmitting ? 'Sending…' : 'Send anonymously'}
      </button>

      <p className="mt-3 text-center font-voice text-[10.5px] text-ink-faint">
        no login · no names · your identity stays anonymous
      </p>
    </form>
  )
}

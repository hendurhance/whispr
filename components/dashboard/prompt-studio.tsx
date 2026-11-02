'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Copy, Loader2, Share2, Shuffle } from 'lucide-react'
import { ALL_PROMPTS, getRandomPrompt, type ResolvedPrompt } from '@/lib/prompts'
import { promptCardUrl, sharePromptCard } from '@/lib/client/share-card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PromptStudioProps {
  profileUrl: string
}

export function PromptStudio({ profileUrl }: PromptStudioProps) {
  const [prompt, setPrompt] = useState<ResolvedPrompt>(getPromptOfTheDay)
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const [isSharing, setIsSharing] = useState(false)

  const cardSrc = promptCardUrl(prompt.id)
  const isLoading = loadedSrc !== cardSrc
  const promptLink = `https://${profileUrl}?q=${prompt.id}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(promptLink)
      toast.success('Link copied. Add it as a link sticker.')
    } catch {
      toast.error('Could not copy')
    }
  }

  const share = async () => {
    setIsSharing(true)
    void navigator.clipboard.writeText(promptLink).then(
      () => toast.success('Link copied. Add it as a link sticker.'),
      () => {},
    )
    try {
      await sharePromptCard(prompt.id)
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <p className="font-display text-xs font-semibold uppercase tracking-wide text-ink-faint">Ask your followers</p>
        <p className="mt-1 text-sm text-ink-soft">Put a question on your story. Followers tap your link to answer anonymously.</p>
      </div>

      <div className="rounded-lg border border-border bg-paper-sink/60 p-4">
        <p className="font-display text-base font-bold leading-snug text-ink">{prompt.text}</p>
        <Button variant="ghost" size="sm" className="-ml-2 mt-2" onClick={() => setPrompt((p) => getRandomPrompt(p.id))}>
          <Shuffle /> Shuffle question
        </Button>
      </div>

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
          alt={`Story card: ${prompt.text}`}
          onLoad={() => setLoadedSrc(cardSrc)}
          onError={() => setLoadedSrc(cardSrc)}
          className={cn(
            'mx-auto max-h-72 w-auto rounded-[3px] border-2 border-ink object-contain shadow-[4px_4px_0_var(--color-ink)] transition-opacity duration-300',
            isLoading && 'opacity-0',
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Button variant="flame" disabled={isSharing} onClick={share}>
          <Share2 /> {isSharing ? 'Preparing…' : 'Share to story'}
        </Button>
        <Button variant="outline" onClick={copyLink}>
          <Copy /> Copy link
        </Button>
      </div>

      <p className="text-xs leading-relaxed text-ink-faint">
        Paste the link into a link sticker. Anyone who taps it sees this question above the message box.
      </p>
    </div>
  )
}

function getPromptOfTheDay(): ResolvedPrompt {
  const day = Math.floor(Date.now() / 86_400_000)
  return ALL_PROMPTS[day % ALL_PROMPTS.length]
}

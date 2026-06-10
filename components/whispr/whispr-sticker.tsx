import { getWhisprTypeIcon, getWhisprTypeLabel, type WhisprType } from '@/types/whispr'
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

export function WhisprSticker({ type, className }: { type: WhisprType; className?: string }) {
  const Icon = getWhisprTypeIcon(type)
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-1.5 rounded-[3px] border-2 border-ink px-2.5 py-1 font-display text-xs font-extrabold shadow-[2px_2px_0_0_var(--color-ink)]',
        STICKER[type],
        className,
      )}
    >
      <Icon className="size-3.5 shrink-0" />
      {getWhisprTypeLabel(type)}
    </span>
  )
}

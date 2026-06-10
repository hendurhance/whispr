import { getWhisprTypeIcon, getWhisprTypeLabel, type WhisprType } from '@/types/whispr'
import { cn } from '@/lib/utils'

const TINT: Record<WhisprType, string> = {
  question: 'bg-ultra/12',
  compliment: 'bg-spot-mint/15',
  roast: 'bg-ember/12',
  confession: 'bg-spot-grape/15',
  rumor: 'bg-spot-sky/15',
  suggestion: 'bg-spot-sun/20',
  secret: 'bg-spot-overprint/12',
  hot_take: 'bg-spot-pink/15',
  dare: 'bg-spot-lime/25',
}

const HUE: Record<WhisprType, string> = {
  question: 'text-ultra',
  compliment: 'text-spot-mint',
  roast: 'text-ember',
  confession: 'text-spot-grape',
  rumor: 'text-spot-sky',
  suggestion: 'text-spot-sun',
  secret: 'text-spot-overprint',
  hot_take: 'text-spot-pink',
  dare: 'text-spot-lime',
}

export function WhisprTypeBadge({ type, className }: { type: WhisprType; className?: string }) {
  const Icon = getWhisprTypeIcon(type)
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none text-ink',
        TINT[type],
        className,
      )}
    >
      <Icon className={cn('size-3 shrink-0', HUE[type])} />
      {getWhisprTypeLabel(type)}
    </span>
  )
}

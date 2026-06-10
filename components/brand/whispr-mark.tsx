import { WHISPR_MARK_PATH } from '@/lib/brand'
import { cn } from '@/lib/utils'

export function WhisprMark({ size = 28, className, accent = false }: { size?: number; className?: string; accent?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 370 370" fill="none" className={className} role="img" aria-label="Whispr">
      <rect width="370" height="370" rx="50" fill={accent ? 'var(--accent, var(--flame))' : 'var(--ink)'} />
      <path d={WHISPR_MARK_PATH} fill={accent ? 'var(--accent-fg, var(--paper))' : 'var(--paper)'} />
    </svg>
  )
}

export function WhisprLogo({ className, markSize = 26, accent = false }: { className?: string; markSize?: number; accent?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <WhisprMark size={markSize} accent={accent} />
      <span className="font-display text-lg font-extrabold tracking-tight text-ink">Whispr</span>
    </span>
  )
}

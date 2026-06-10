import { ImageResponse } from 'next/og'
import { ShareCard, ogFonts, OG_SIZES, type OgFormat } from '@/lib/og/share-card'
import { resolveAccent, resolvePaperMode } from '@/lib/accents'
import { isValidWhisprType } from '@/utils/validation'
import type { WhisprType } from '@/types/whispr'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams

  const content = (sp.get('content') ?? '').trim().slice(0, 500) || 'an anonymous whispr'
  const rawType = sp.get('type') ?? 'question'
  const type: WhisprType = (isValidWhisprType(rawType) ? rawType : 'question') as WhisprType
  const handle = (sp.get('handle') ?? 'whispr').replace(/[^a-zA-Z0-9_]/g, '').slice(0, 30) || 'whispr'
  const rawFormat = sp.get('format') ?? 'square'
  const format: OgFormat = (['story', 'square', 'og'].includes(rawFormat) ? rawFormat : 'square') as OgFormat
  const accent = resolveAccent(sp.get('accent'))
  const mode = resolvePaperMode(sp.get('mode'))

  return new ImageResponse(
    ShareCard({ content, type, handle, kind: 'whispr', format, accent: accent.hex, accentFg: accent.fg, mode }),
    { ...OG_SIZES[format], fonts: ogFonts() },
  )
}

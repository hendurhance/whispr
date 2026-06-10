import { ImageResponse } from 'next/og'
import { ShareCard, ogFonts, OG_SIZES } from '@/lib/og/share-card'
import { createClient } from '@/utils/supabase/server'
import { resolveAccent, resolvePaperMode } from '@/lib/accents'

export const runtime = 'nodejs'
export const alt = 'Send me an anonymous message on Whispr'
export const size = OG_SIZES.og
export const contentType = 'image/png'

export default async function OpengraphImage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const handle = username.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 30) || 'whispr'

  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('selected_theme, selected_background')
    .eq('username', username.toLowerCase())
    .maybeSingle()
  const accent = resolveAccent(data?.selected_theme)
  const mode = resolvePaperMode(data?.selected_background)

  return new ImageResponse(
    ShareCard({ content: 'send me something — anonymously', type: 'question', handle, kind: 'profile', format: 'og', accent: accent.hex, accentFg: accent.fg, mode }),
    { ...size, fonts: ogFonts() },
  )
}

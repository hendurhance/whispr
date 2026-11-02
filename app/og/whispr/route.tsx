import { ImageResponse } from 'next/og'
import { z } from 'zod'
import { ShareCard, ogFonts, OG_SIZES } from '@/lib/og/share-card'
import { resolveAccent, resolvePaperMode } from '@/lib/accents'
import { resolvePrompt } from '@/lib/prompts'
import { ANSWER_MAX_LENGTH } from '@/lib/inbox'
import { createClient } from '@/utils/supabase/server'
import { isValidWhisprType } from '@/utils/validation'
import type { WhisprType } from '@/types/whispr'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams
  const parsed = cardQuerySchema.safeParse(Object.fromEntries(sp))
  if (!parsed.success) return new Response('Bad request', { status: 400 })
  const query = parsed.data

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const [{ data: profile }, whisprResult] = await Promise.all([
    supabase.from('profiles').select('username, selected_theme, selected_background').eq('user_id', user.id).maybeSingle(),
    query.kind === 'whispr'
      ? supabase.from('whisprs').select('content, type, answer').eq('id', query.id).eq('user_id', user.id).maybeSingle()
      : null,
  ])
  if (!profile) return new Response('Not found', { status: 404 })

  const accent = resolveAccent(profile.selected_theme)
  const mode = resolvePaperMode(profile.selected_background)
  const common = { handle: profile.username, format: query.format, accent: accent.hex, accentFg: accent.fg, mode }
  const init = { ...OG_SIZES[query.format], fonts: ogFonts(), headers: { 'Cache-Control': 'private, no-store' } }

  if (query.kind === 'prompt') {
    const prompt = resolvePrompt(query.q)
    if (!prompt) return new Response('Not found', { status: 404 })
    return new ImageResponse(ShareCard({ ...common, kind: 'prompt', content: prompt.text, type: prompt.type }), init)
  }

  const whispr = whisprResult?.data
  if (!whispr) return new Response('Not found', { status: 404 })
  // The owner may preview an unsaved draft answer; it is still only their own whispr.
  const answer = (query.answer ?? whispr.answer ?? '').trim().slice(0, ANSWER_MAX_LENGTH) || undefined
  const type = (isValidWhisprType(whispr.type) ? whispr.type : 'question') as WhisprType

  return new ImageResponse(ShareCard({ ...common, kind: 'whispr', content: whispr.content, type, answer }), init)
}

const formatSchema = z.enum(['square', 'story']).catch('square')

const cardQuerySchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('whispr'), id: z.uuid(), format: formatSchema, answer: z.string().optional() }),
  z.object({ kind: z.literal('prompt'), q: z.string().max(100), format: formatSchema }),
])

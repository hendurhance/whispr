import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getWhisprTypeLabel, type WhisprType } from '@/types/whispr'
import { WHISPR_MARK_PATH } from '@/lib/brand'

const FONT_DIR = join(process.cwd(), 'app/og/fonts')

export function ogFonts() {
  return [
    { name: 'Bricolage', data: readFileSync(join(FONT_DIR, 'bricolage-800.ttf')), weight: 800 as const, style: 'normal' as const },
    { name: 'Fraunces', data: readFileSync(join(FONT_DIR, 'fraunces-italic-500.ttf')), weight: 500 as const, style: 'italic' as const },
    { name: 'SplineMono', data: readFileSync(join(FONT_DIR, 'spline-mono-500.ttf')), weight: 500 as const, style: 'normal' as const },
  ]
}

export type OgFormat = 'story' | 'square' | 'og'

export const OG_SIZES: Record<OgFormat, { width: number; height: number }> = {
  story: { width: 1080, height: 1920 },
  square: { width: 1080, height: 1080 },
  og: { width: 1200, height: 630 },
}

const PALETTE = {
  light: { paper: '#F4EEE2', paper2: '#FBF7EE', ink: '#1C1812', faint: '#8C8475' },
  dark: { paper: '#14110C', paper2: '#1E1A12', ink: '#F3ECDD', faint: '#897F6B' },
} as const

const DEFAULT_ACCENT = '#2433CC'
const DEFAULT_ACCENT_FG = '#FFFFFF'

const SPOT: Record<WhisprType, string> = {
  question: '#2330C9',
  compliment: '#1FB58F',
  roast: '#FF4D2E',
  confession: '#8A5CFF',
  rumor: '#38B6FF',
  suggestion: '#FFC13B',
  secret: '#5B2E6E',
  hot_take: '#FF5C8A',
  dare: '#B7E000',
}
const WHITE_TEXT: WhisprType[] = ['question', 'confession', 'secret']
const STICKER_LIGHT = '#FBF7EE'
const STICKER_DARK = '#1C1812'

const SIZES: Record<OgFormat, { pad: number; panelPad: number; mast: number; folio: number; quote: number; anon: number; url: number; sticker: number; shadow: number; border: number }> = {
  story: { pad: 72, panelPad: 64, mast: 48, folio: 24, quote: 82, anon: 28, url: 27, sticker: 28, shadow: 16, border: 4 },
  square: { pad: 60, panelPad: 54, mast: 44, folio: 22, quote: 68, anon: 26, url: 25, sticker: 26, shadow: 14, border: 4 },
  og: { pad: 38, panelPad: 38, mast: 30, folio: 16, quote: 46, anon: 18, url: 18, sticker: 18, shadow: 10, border: 3 },
}

interface ShareCardProps {
  content: string
  type: WhisprType
  handle: string
  kind: 'whispr' | 'profile'
  format: OgFormat
  accent?: string
  accentFg?: string
  mode?: 'light' | 'dark'
}

export function ShareCard({ content, type, handle, kind, format, accent = DEFAULT_ACCENT, accentFg = DEFAULT_ACCENT_FG, mode = 'light' }: ShareCardProps) {
  const { width, height } = OG_SIZES[format]
  const s = SIZES[format]
  const p = PALETTE[mode]
  const len = content.length
  const quoteSize = Math.round(s.quote * (len > 220 ? 0.62 : len > 140 ? 0.78 : len > 80 ? 0.9 : 1))
  const stickerColor = WHITE_TEXT.includes(type) ? STICKER_LIGHT : STICKER_DARK

  return (
    <div style={{ width, height, display: 'flex', backgroundColor: p.paper, padding: s.pad, fontFamily: 'SplineMono' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          backgroundColor: p.paper2,
          border: `${s.border}px solid ${p.ink}`,
          borderRadius: 8,
          boxShadow: `${s.shadow}px ${s.shadow}px 0 ${p.ink}`,
          padding: s.panelPad,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: `${s.border}px solid ${p.ink}`, paddingBottom: Math.round(s.pad * 0.28) }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg width={Math.round(s.mast * 0.95)} height={Math.round(s.mast * 0.95)} viewBox="0 0 370 370" style={{ marginRight: Math.round(s.mast * 0.3) }}>
              <rect width="370" height="370" rx="50" fill={accent} />
              <path d={WHISPR_MARK_PATH} fill={accentFg} />
            </svg>
            <span style={{ fontFamily: 'Bricolage', fontWeight: 800, fontSize: s.mast, letterSpacing: -1, color: p.ink }}>WHISPR</span>
          </div>
          <div style={{ display: 'flex', fontSize: s.folio, color: p.faint, letterSpacing: 2 }}>ANON · NO. 042</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', paddingTop: Math.round(s.panelPad * 0.45), paddingBottom: Math.round(s.panelPad * 0.35) }}>
          {kind === 'whispr' ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontFamily: 'Fraunces', fontStyle: 'italic', fontWeight: 500, fontSize: quoteSize, lineHeight: 1.2, color: p.ink }}>
                {`“${content}”`}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: Math.round(s.pad * 0.4), fontSize: s.anon, color: p.faint }}>
                — anonymous
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontFamily: 'Bricolage', fontWeight: 800, fontSize: Math.round(s.quote * 1.1), letterSpacing: -1, color: p.ink }}>@{handle}</div>
              <div style={{ display: 'flex', fontFamily: 'Fraunces', fontStyle: 'italic', fontWeight: 500, fontSize: Math.round(s.quote * 0.6), color: p.ink, marginTop: Math.round(s.pad * 0.25) }}>
                {content}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `${s.border}px solid ${p.ink}`, paddingTop: Math.round(s.pad * 0.28) }}>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: s.url, color: p.ink }}>
            <span>trywhispr.me/{handle}</span>
          </div>
          <div
            style={{
              display: 'flex',
              transform: 'rotate(-3deg)',
              backgroundColor: kind === 'whispr' ? SPOT[type] : accent,
              color: kind === 'whispr' ? stickerColor : accentFg,
              border: `${s.border}px solid ${p.ink}`,
              borderRadius: 6,
              boxShadow: `4px 4px 0 ${p.ink}`,
              padding: `${Math.round(s.sticker * 0.32)}px ${Math.round(s.sticker * 0.6)}px`,
              fontFamily: 'Bricolage',
              fontWeight: 800,
              fontSize: s.sticker,
            }}
          >
            {kind === 'whispr' ? getWhisprTypeLabel(type) : 'ANON MESSAGE'}
          </div>
        </div>
      </div>
    </div>
  )
}

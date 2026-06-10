export const ACCENTS = {
  flame: { hex: '#FF4D2E', fg: '#1c1812', label: 'Flame' },
  ultra: { hex: '#2330C9', fg: '#ffffff', label: 'Ultramarine' },
  mint: { hex: '#1FB58F', fg: '#0c1f1a', label: 'Mint' },
  grape: { hex: '#8A5CFF', fg: '#ffffff', label: 'Grape' },
  pink: { hex: '#FF5C8A', fg: '#1c1812', label: 'Pink' },
  lime: { hex: '#B7E000', fg: '#1c2400', label: 'Lime' },
  sun: { hex: '#FFC13B', fg: '#1c1812', label: 'Sun' },
  sky: { hex: '#38B6FF', fg: '#0a1a26', label: 'Sky' },
} as const

export type AccentId = keyof typeof ACCENTS
export const ACCENT_IDS = Object.keys(ACCENTS) as AccentId[]
export const DEFAULT_ACCENT: AccentId = 'ultra'

export function resolveAccent(id?: string | null) {
  const key = id && (id as AccentId) in ACCENTS ? (id as AccentId) : DEFAULT_ACCENT
  return ACCENTS[key]
}

export type PaperMode = 'light' | 'dark'
export function resolvePaperMode(value?: string | null): PaperMode {
  return value === 'dark' ? 'dark' : 'light'
}

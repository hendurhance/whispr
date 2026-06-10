import { toast } from 'react-hot-toast'
import type { Whispr } from '@/types/whispr'

type CardFormat = 'square' | 'story'

function cardUrl(whispr: Whispr, handle: string, format: CardFormat, accent?: string, mode?: string) {
  const params = new URLSearchParams({ content: whispr.content, type: whispr.type, handle, format })
  if (accent) params.set('accent', accent)
  if (mode) params.set('mode', mode)
  return `/og/whispr?${params.toString()}`
}

async function fetchCard(whispr: Whispr, handle: string, format: CardFormat, accent?: string, mode?: string): Promise<Blob> {
  const res = await fetch(cardUrl(whispr, handle, format, accent, mode))
  if (!res.ok) throw new Error('Could not render share card')
  return res.blob()
}

function triggerDownload(blob: Blob, whisprId: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `whispr-${whisprId}.png`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export async function downloadShareCard(whispr: Whispr, handle: string, format: CardFormat = 'square', accent?: string, mode?: string) {
  try {
    const blob = await fetchCard(whispr, handle, format, accent, mode)
    triggerDownload(blob, whispr.id)
    toast.success('Card downloaded')
  } catch {
    toast.error('Could not make the card')
  }
}

export async function shareShareCard(whispr: Whispr, handle: string, format: CardFormat = 'story', accent?: string, mode?: string) {
  let blob: Blob
  try {
    blob = await fetchCard(whispr, handle, format, accent, mode)
  } catch {
    toast.error('Could not make the card')
    return
  }

  const file = new File([blob], `whispr-${whispr.id}.png`, { type: 'image/png' })

  if (typeof navigator !== 'undefined' && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Whispr', text: 'an anonymous whispr' })
      return
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return
    }
  }

  triggerDownload(blob, whispr.id)
  toast.success('Card downloaded')
}

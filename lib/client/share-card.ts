import { toast } from 'react-hot-toast'
import type { Whispr } from '@/types/whispr'

type CardFormat = 'square' | 'story'

export function cardUrl(whispr: Whispr, format: CardFormat) {
  const params = new URLSearchParams({ kind: 'whispr', id: whispr.id, format, answer: whispr.answer ?? '' })
  return `/og/whispr?${params.toString()}`
}

export function promptCardUrl(promptId: string) {
  const params = new URLSearchParams({ kind: 'prompt', q: promptId, format: 'story' })
  return `/og/whispr?${params.toString()}`
}

async function fetchCard(url: string): Promise<Blob> {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Could not render share card')
  return res.blob()
}

function triggerDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${name}.png`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export async function downloadShareCard(whispr: Whispr, format: CardFormat = 'square') {
  try {
    const blob = await fetchCard(cardUrl(whispr, format))
    triggerDownload(blob, `whispr-${whispr.id}`)
    toast.success('Card downloaded')
  } catch {
    toast.error('Could not make the card')
  }
}

export async function shareShareCard(whispr: Whispr, format: CardFormat = 'story') {
  await shareCardImage(cardUrl(whispr, format), `whispr-${whispr.id}`)
}

export async function sharePromptCard(promptId: string) {
  await shareCardImage(promptCardUrl(promptId), 'whispr-ask')
}

async function shareCardImage(url: string, name: string) {
  let blob: Blob
  try {
    blob = await fetchCard(url)
  } catch {
    toast.error('Could not make the card')
    return
  }

  const file = new File([blob], `${name}.png`, { type: 'image/png' })

  if (typeof navigator !== 'undefined' && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Whispr', text: 'an anonymous whispr' })
      return
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return
    }
  }

  triggerDownload(blob, name)
  toast.success('Card downloaded')
}

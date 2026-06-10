'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'

export function CopyablePrompts({ prompts }: { prompts: string[] }) {
  const [copied, setCopied] = useState<number | null>(null)

  const copy = async (text: string, i: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(i)
      toast.success('Copied — paste it anywhere')
      setTimeout(() => setCopied((c) => (c === i ? null : c)), 1500)
    } catch {
      toast.error('Could not copy')
    }
  }

  return (
    <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
      {prompts.map((p, i) => (
        <li key={i}>
          <button
            onClick={() => copy(p, i)}
            title="Copy prompt"
            className="group flex h-full w-full items-start gap-3 rounded-[4px] border-2 border-ink bg-paper-2 px-4 py-3 text-left font-voice text-sm leading-relaxed shadow-[3px_3px_0_0_var(--color-ink)] transition-[transform,box-shadow] hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          >
            <span className="flex-1">“{p}”</span>
            <span className="mt-0.5 shrink-0 text-ink-faint group-hover:text-flame">
              {copied === i ? <Check className="size-4 text-flame" strokeWidth={3} /> : <Copy className="size-4" />}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { Dices } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { getWhisprTypeIcon, getWhisprTypeLabel, type WhisprType } from '@/types/whispr'
import { WhisprMark } from '@/components/brand/whispr-mark'
import { cn } from '@/lib/utils'

const TYPES: WhisprType[] = ['question', 'compliment', 'roast', 'confession', 'dare', 'hot_take', 'secret', 'rumor', 'suggestion']

const STICKER: Record<WhisprType, string> = {
  question: 'bg-ultra text-white',
  compliment: 'bg-spot-mint text-ink',
  roast: 'bg-ember text-ink',
  confession: 'bg-spot-grape text-white',
  rumor: 'bg-spot-sky text-ink',
  suggestion: 'bg-spot-sun text-ink',
  secret: 'bg-spot-overprint text-white',
  hot_take: 'bg-spot-pink text-ink',
  dare: 'bg-spot-lime text-ink',
}

const PROMPTS: Partial<Record<WhisprType, string[]>> = {
  question: ["what's the most unhinged thing you've done for clout?", "what's your actual secret to staying consistent?"],
  roast: ['your tweets are so dry they need a hydration sponsor.', 'your fashion sense is a thrift store mid-crisis.'],
  compliment: ['your energy is genuinely contagious.', 'you make chaos look effortless.'],
  confession: ["i've lurked your account for a year. so… hi.", 'i hyped you to everyone and never told you.'],
  dare: ['post the first photo in your camera roll. no cropping.', 'tweet your most controversial take. now.'],
}
const GENERIC = ["what's the realest thing you've never told anyone?", "what's a hill you'll die on?", "what's something you'd only say anonymously?"]

const FLOATERS = [
  { text: 'your energy is unmatched.', cls: '-top-12 left-2 -rotate-4', tone: 'bg-spot-mint text-ink' },
  { text: "what's the tea you'll never post?", cls: '-bottom-12 left-4 rotate-2', tone: 'bg-spot-grape text-white' },
  { text: 'i dare you. no cropping.', cls: '-bottom-14 right-8 rotate-4', tone: 'bg-spot-lime text-ink' },
]

export function LandingDemoBox() {
  const scope = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const [type, setType] = useState<WhisprType>('question')
  const [content, setContent] = useState('')
  const [sent, setSent] = useState(false)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.from(boxRef.current, { opacity: 0, scale: 1.05, rotate: -1.5, duration: 0.5, ease: 'back.out(1.6)' })
      gsap.to('.demo-floater', { y: '+=10', rotation: '+=2', duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.4 })
    },
    { scope },
  )

  const roll = () => {
    const list = PROMPTS[type] ?? GENERIC
    setContent(list[Math.floor(Math.random() * list.length)])
  }

  const send = () => {
    if (!content.trim()) return
    setSent(true)
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo('.demo-stamp', { scale: 1.4, rotate: -8, opacity: 0 }, { scale: 1, rotate: -4, opacity: 1, duration: 0.45, ease: 'back.out(2)' })
    }
  }

  const reset = () => {
    setSent(false)
    setContent('')
  }

  return (
    <div ref={scope} className="relative w-full max-w-sm">
      {FLOATERS.map((f, i) => (
        <div
          key={i}
          className={cn(
            'demo-floater pointer-events-none absolute z-0 hidden max-w-[12rem] rounded-[3px] border-2 border-ink px-2.5 py-1.5 font-voice text-[11px] leading-snug shadow-[3px_3px_0_0_var(--color-ink)] md:block',
            f.tone,
            f.cls,
          )}
        >
          {f.text}
        </div>
      ))}

      <div ref={boxRef} className="relative z-10 rounded-[4px] border-2 border-ink bg-paper-2 p-5 shadow-[10px_10px_0_0_var(--color-ink)]">
        <div className="flex items-center gap-3 border-b-2 border-ink pb-3">
          <span className="flex size-9 items-center justify-center rounded-full border-2 border-ink bg-flame">
            <WhisprMark size={16} />
          </span>
          <div className="min-w-0">
            <p className="font-display text-sm font-extrabold leading-none">send me something</p>
            <p className="mt-1 font-voice text-[10px] text-ink-faint">anonymously · to @you</p>
          </div>
        </div>

        {sent ? (
          <div className="flex flex-col items-center py-6 text-center">
            <span className="demo-stamp inline-flex items-center gap-1.5 rounded-[3px] border-2 border-ink bg-flame px-3 py-1.5 font-display text-sm font-extrabold text-white shadow-[3px_3px_0_0_var(--color-ink)]">
              ✓ stamped &amp; sent
            </span>
            <p className="mt-4 font-display text-lg font-extrabold">that&apos;s the vibe.</p>
            <p className="mt-1 text-sm text-ink-soft">get your own link and collect them for real.</p>
            <div className="mt-4 flex gap-2">
              <Link
                href="/auth"
                className="rounded-[3px] border-2 border-ink bg-flame px-4 py-2 font-display text-sm font-extrabold text-white shadow-[4px_4px_0_0_var(--color-ink)] transition-[transform,box-shadow] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                Claim your link
              </Link>
              <button onClick={reset} className="rounded-[3px] border-2 border-ink bg-paper px-4 py-2 font-display text-sm font-extrabold text-ink">
                Try again
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="scrollbar-hide mt-4 flex gap-2 overflow-x-auto pb-2">
              {TYPES.map((t) => {
                const Icon = getWhisprTypeIcon(t)
                const active = t === type
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={cn(
                      'inline-flex shrink-0 items-center gap-1.5 rounded-[3px] border-2 border-ink px-2.5 py-1 font-display text-xs font-extrabold transition-transform',
                      active ? cn(STICKER[t], 'shadow-[2px_2px_0_0_var(--color-ink)]') : 'bg-paper text-ink-soft hover:-translate-y-0.5',
                    )}
                  >
                    <Icon className="size-3.5 shrink-0" />
                    {getWhisprTypeLabel(t)}
                  </button>
                )
              })}
            </div>

            <div className="relative mt-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, 300))}
                rows={3}
                placeholder={`write an anonymous ${getWhisprTypeLabel(type).toLowerCase()}…`}
                className="w-full resize-none rounded-[3px] border-2 border-ink bg-paper px-3 py-2.5 font-voice text-sm text-ink outline-none placeholder:text-ink-faint focus:ring-2 focus:ring-ultra"
              />
              <button
                type="button"
                onClick={roll}
                title="Roll a prompt"
                aria-label="Roll a prompt"
                className="absolute bottom-2.5 right-2.5 flex size-8 items-center justify-center rounded-[3px] border-2 border-ink bg-spot-sun text-ink shadow-[2px_2px_0_0_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                <Dices className="size-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={send}
              disabled={!content.trim()}
              className="mt-3 w-full rounded-[3px] border-2 border-ink bg-flame px-4 py-2.5 font-display text-sm font-extrabold text-white shadow-[4px_4px_0_0_var(--color-ink)] transition-[transform,box-shadow] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:shadow-[2px_2px_0_0_var(--color-ink)]"
            >
              Send anonymously
            </button>
            <p className="mt-2 text-center font-voice text-[10px] text-ink-faint">demo — nothing is actually sent</p>
          </>
        )}
      </div>
    </div>
  )
}

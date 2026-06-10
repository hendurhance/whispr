import type { WhisprType } from '@/types/whispr'
import { WhisprSticker } from '@/components/whispr/whispr-sticker'
import { Reveal } from './reveal'

const TYPES: { type: WhisprType; example: string }[] = [
  { type: 'question', example: "what's your actual secret to staying consistent?" },
  { type: 'compliment', example: 'your energy is genuinely contagious.' },
  { type: 'roast', example: 'your tweets are so dry they need a hydration sponsor.' },
  { type: 'confession', example: "i've lurked your account for a year. so… hi." },
  { type: 'dare', example: 'post the first photo in your camera roll. no cropping.' },
  { type: 'hot_take', example: 'your old stuff was better before you blew up.' },
  { type: 'secret', example: "i'm the one who hyped you to everyone." },
  { type: 'rumor', example: 'heard you started a rap battle at a party.' },
  { type: 'suggestion', example: "start a podcast — i'd actually listen." },
]

export function LandingFeatures() {
  return (
    <section id="types" className="border-y-2 border-ink bg-paper-sink/40">
      <div className="mx-auto max-w-5xl px-5 py-16">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Nine ways to get real.</h2>
          <p className="mt-3 max-w-lg text-ink-soft">
            Senders pick a type, you collect the chaos — questions, roasts, confessions, dares — all anonymous.
          </p>
        </Reveal>
        <Reveal className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {TYPES.map(({ type, example }) => (
            <div key={type} className="rounded-[4px] border-2 border-ink bg-paper-2 p-4 shadow-[4px_4px_0_0_var(--color-ink)]">
              <WhisprSticker type={type} />
              <p className="mt-3 font-voice text-sm leading-relaxed text-ink-soft">“{example}”</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

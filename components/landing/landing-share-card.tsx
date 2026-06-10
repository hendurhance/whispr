import type { WhisprType } from '@/types/whispr'
import { WhisprMark } from '@/components/brand/whispr-mark'
import { WhisprSticker } from '@/components/whispr/whispr-sticker'
import { cn } from '@/lib/utils'
import { Reveal } from './reveal'
import { PressLink } from './press-link'

function DemoCard({ content, type, className }: { content: string; type: WhisprType; className?: string }) {
  return (
    <div className={cn('w-72 rounded-[4px] border-2 border-ink bg-paper-2 p-5 shadow-[8px_8px_0_0_var(--color-ink)]', className)}>
      <div className="flex items-center justify-between border-b-2 border-ink pb-2.5">
        <span className="flex items-center gap-1.5">
          <WhisprMark size={16} />
          <span className="font-display text-xs font-extrabold tracking-tight">WHISPR</span>
        </span>
        <span className="font-voice text-[9px] tracking-widest text-ink-faint">ANON · NO. 042</span>
      </div>
      <p className="my-4 font-serif text-lg italic leading-snug">“{content}”</p>
      <p className="text-right font-voice text-[10px] text-ink-faint">— anonymous</p>
      <div className="mt-3 flex items-center justify-between border-t-2 border-ink pt-2.5">
        <span className="font-voice text-[10px]">trywhispr.me/alex</span>
        <WhisprSticker type={type} className="text-[10px]" />
      </div>
    </div>
  )
}

export function LandingShareCard() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-20">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <Reveal>
          <p className="font-voice text-xs uppercase tracking-[0.2em] text-flame">the billboard</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Made to be screenshotted.</h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
            Every whispr becomes a printed card — paper, ink, your @handle. Post it to your story and the link rides along, so the next message is one tap away.
          </p>
          <div className="mt-7">
            <PressLink href="/auth">Make your first card →</PressLink>
          </div>
        </Reveal>

        <Reveal y={36}>
          <div className="relative flex h-[22rem] items-center justify-center">
            <DemoCard
              content="your old stuff was better before you blew up."
              type="hot_take"
              className="absolute -translate-x-10 translate-y-5 -rotate-6"
            />
            <DemoCard
              content="i've lurked your account for a year. so… hi."
              type="confession"
              className="absolute translate-x-12 -translate-y-3 rotate-6"
            />
            <DemoCard content="your tweets are so dry they need a hydration sponsor." type="roast" className="relative z-10" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

import { EyeOff, Trash2, Github, Ban } from 'lucide-react'
import { Reveal } from './reveal'

const PILLARS = [
  { icon: EyeOff, title: 'Truly anonymous', body: 'No account needed to send. Senders stay anonymous — you just get the message.' },
  { icon: Trash2, title: "You're in control", body: 'Delete anything, pause incoming whenever. Your inbox, your rules.' },
  { icon: Github, title: 'Open source', body: "Whispr's code is public — check exactly how anonymity works." },
  { icon: Ban, title: 'No ads, no games', body: 'A clean place for honest words. No tracking gimmicks.' },
]

export function LandingTrust() {
  return (
    <section id="trust" className="border-t-2 border-ink bg-paper-sink/40">
      <div className="mx-auto max-w-5xl px-5 py-16">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Built to be trusted.</h2>
        </Reveal>
        <Reveal className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {PILLARS.map((p) => (
            <div key={p.title} className="rounded-[4px] border-2 border-ink bg-paper-2 p-5 shadow-[4px_4px_0_0_var(--color-ink)]">
              <p.icon className="size-6 text-flame" />
              <h3 className="mt-3 font-display text-lg font-extrabold">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{p.body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

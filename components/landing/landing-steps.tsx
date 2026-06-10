import { Reveal } from './reveal'

const STEPS = [
  { n: '01', title: 'Claim your link', body: 'Sign up in seconds and pick a username. You get trywhispr.me/you.' },
  { n: '02', title: 'Share it everywhere', body: 'Drop your link on Instagram, TikTok, X — wherever your people are.' },
  { n: '03', title: 'Read & share', body: 'Anonymous whisprs land in your inbox. Turn the best into a printed card and post it to your story.' },
]

export function LandingSteps() {
  return (
    <section id="how" className="mx-auto max-w-5xl px-5 py-16">
      <Reveal>
        <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">How it works</h2>
      </Reveal>
      <Reveal className="mt-8 grid gap-5 md:grid-cols-3" stagger={0.1}>
        {STEPS.map((s) => (
          <div key={s.n} className="rounded-[4px] border-2 border-ink bg-paper-2 p-6 shadow-[5px_5px_0_0_var(--color-ink)]">
            <div className="font-display text-4xl font-extrabold text-flame">{s.n}</div>
            <h3 className="mt-3 font-display text-xl font-extrabold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
          </div>
        ))}
      </Reveal>
    </section>
  )
}

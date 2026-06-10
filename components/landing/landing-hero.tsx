import { Reveal } from './reveal'
import { LandingDemoBox } from './landing-demo-box'
import { PressLink } from './press-link'

export function LandingHero() {
  return (
    <section className="mx-auto grid max-w-5xl items-center gap-12 px-5 py-12 md:grid-cols-2 md:py-20">
      <Reveal y={30} stagger={0.12}>
        <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl">
          Send me anything.
          <br />
          <span className="text-flame">Anonymously.</span>
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
          Share your link and collect anonymous questions, confessions, roasts and real feedback — then turn the best into a printed card for your story.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <PressLink href="/auth">Get your free link →</PressLink>
          <a
            href="#how"
            className="inline-flex items-center rounded-[3px] border-2 border-ink bg-paper px-5 py-3 font-display font-extrabold text-ink transition-transform hover:-translate-y-0.5"
          >
            See how it works
          </a>
        </div>
      </Reveal>

      <div className="flex justify-center md:justify-end">
        <LandingDemoBox />
      </div>
    </section>
  )
}

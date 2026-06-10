import { WhisprLogo } from '@/components/brand/whispr-mark'
import { SiteFooter } from '@/components/site-footer'
import { PressLink } from './press-link'
import { Reveal } from './reveal'
import { LandingHero } from './landing-hero'
import { LandingFeatures } from './landing-features'
import { LandingShareCard } from './landing-share-card'
import { LandingSteps } from './landing-steps'
import { LandingTrust } from './landing-trust'

export function Landing() {
  return (
    <div data-tier="press" className="relative min-h-[100dvh] overflow-x-hidden bg-paper text-ink">
      <div className="press-grain" />
      <div className="relative z-10">
        <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
          <WhisprLogo markSize={26} />
          <nav className="hidden items-center gap-7 text-sm font-medium text-ink-soft sm:flex">
            <a href="#types" className="hover:text-ink">Types</a>
            <a href="#how" className="hover:text-ink">How it works</a>
            <a href="#trust" className="hover:text-ink">Privacy</a>
          </nav>
          <PressLink href="/auth" className="px-4 py-2 text-sm">Get your link</PressLink>
        </header>

        <LandingHero />
        <LandingFeatures />
        <LandingShareCard />
        <LandingSteps />
        <LandingTrust />

        <section className="mx-auto max-w-5xl px-5 py-20 text-center">
          <Reveal>
            <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Ready to hear the truth?</h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-soft">
              Claim your link and find out what people would say if it stayed anonymous.
            </p>
            <div className="mt-7 flex justify-center">
              <PressLink href="/auth">Get your free link →</PressLink>
            </div>
          </Reveal>
        </section>

        <SiteFooter />
      </div>
    </div>
  )
}

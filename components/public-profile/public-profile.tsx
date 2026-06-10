'use client'

import { useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { resolveAccent, resolvePaperMode } from '@/lib/accents'
import { WhisprLogo } from '@/components/brand/whispr-mark'
import { ProfileHeader, type PublicSocialLink } from './profile-header'
import { SubmissionForm } from './submission-form'

export interface PublicProfileData {
  username: string
  displayName: string | null
  avatarUrl: string | null
  bio: string | null
  totalWhisprs: number
  displaySocialLinks: boolean
  socialLinks: PublicSocialLink[]
  allowAnonymous: boolean
  selectedTheme?: string | null
  selectedBackground?: string | null
}

interface PublicProfileProps {
  initialProfile: PublicProfileData | null
  username: string
}

export function PublicProfile({ initialProfile, username }: PublicProfileProps) {
  const [profile, setProfile] = useState(initialProfile)
  const [sent, setSent] = useState(false)

  if (!profile) {
    return (
      <div data-tier="press" className="relative flex min-h-[100dvh] flex-col items-center justify-center bg-paper px-6 text-center text-ink">
        <div className="press-grain" />
        <div className="relative z-10">
          <p className="font-display text-3xl font-extrabold tracking-tight">Profile not found</p>
          <p className="mt-2 text-ink-soft">@{username} doesn&apos;t exist or has been removed.</p>
          <Link href="/" className="mt-6 inline-block rounded-[3px] border-2 border-ink bg-flame px-5 py-2.5 font-display font-extrabold text-white shadow-[4px_4px_0_0_var(--color-ink)] transition-[transform,box-shadow] active:translate-x-1 active:translate-y-1 active:shadow-none">
            Go home
          </Link>
        </div>
      </div>
    )
  }

  const handleSuccess = () => {
    setSent(true)
    toast.success('Your whispr has been sent!')
    setProfile((p) => (p ? { ...p, totalWhisprs: p.totalWhisprs + 1 } : p))
    setTimeout(() => setSent(false), 3500)
  }

  const handleError = (error: unknown) => {
    toast.error(error instanceof Error ? error.message : 'Failed to send whispr')
  }

  const accent = resolveAccent(profile.selectedTheme)
  const mode = resolvePaperMode(profile.selectedBackground)

  return (
    <div
      data-tier="press"
      data-mode={mode}
      className="relative flex min-h-[100dvh] flex-col bg-paper text-ink"
      style={{ ['--accent']: accent.hex, ['--accent-fg']: accent.fg } as CSSProperties}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(180deg, color-mix(in oklab, var(--accent) 18%, transparent), color-mix(in oklab, var(--accent) 5%, transparent) 60%, transparent)' }}
      />
      <div className="press-grain" />

      <header className="relative z-10 flex items-center justify-between px-5 py-4">
        <WhisprLogo markSize={24} accent />
        <Link href="/" className="font-voice text-xs text-ink-faint underline-offset-4 hover:text-ink hover:underline">
          make your own →
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-5 py-8">
        <div className="w-full max-w-md">
          <ProfileHeader
            username={profile.username}
            displayName={profile.displayName}
            avatarUrl={profile.avatarUrl}
            bio={profile.bio}
            totalWhisprs={profile.totalWhisprs}
            displaySocialLinks={profile.displaySocialLinks}
            socialLinks={profile.socialLinks}
            allowAnonymous={profile.allowAnonymous}
          />

          {profile.allowAnonymous &&
            (sent ? (
              <div className="rounded-[4px] border-2 border-ink bg-paper-2 p-8 text-center shadow-[6px_6px_0_0_var(--color-ink)]">
                <span className="mx-auto flex size-14 items-center justify-center rounded-full border-2 border-ink bg-[var(--accent)] shadow-[3px_3px_0_0_var(--color-ink)]">
                  <Check className="size-7 text-[var(--accent-fg)]" strokeWidth={2.5} />
                </span>
                <h2 className="mt-4 font-display text-xl font-extrabold tracking-tight text-ink">Stamped &amp; sent</h2>
                <p className="mt-1 text-sm text-ink-soft">Your anonymous whispr was delivered.</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-5 rounded-[3px] border-2 border-ink bg-paper px-5 py-2.5 font-display font-extrabold text-ink shadow-[4px_4px_0_0_var(--color-ink)] transition-[transform,box-shadow] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  Send another
                </button>
              </div>
            ) : (
              <SubmissionForm username={profile.username} onSuccess={handleSuccess} onError={handleError} />
            ))}
        </div>
      </main>

      <footer className="relative z-10 px-5 py-5 text-center font-voice text-[10.5px] text-ink-faint">
        anonymous message · trywhispr.me
      </footer>
    </div>
  )
}

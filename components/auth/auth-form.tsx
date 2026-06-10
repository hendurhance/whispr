'use client'

import { useState, useEffect, type FormEvent } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { MailCheck, Loader2 } from 'lucide-react'
import { signInWithMagicLink } from '@/lib/client/auth'
import { APP_URL } from '@/configs'
import { WhisprLogo } from '@/components/brand/whispr-mark'

export function AuthScreen() {
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const redirectError = searchParams.get('error')
    const errorMessage = searchParams.get('error_description')
    if (redirectError && errorMessage) {
      setError(decodeURIComponent(errorMessage.replace(/\+/g, ' ')))
    }
  }, [searchParams])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      const base = APP_URL || (typeof window !== 'undefined' ? window.location.origin : '')
      const { error } = await signInWithMagicLink(email, `${base}/auth/confirm`)
      if (error) throw error
      setIsEmailSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send magic link. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div data-tier="press" className="relative flex min-h-[100dvh] flex-col bg-paper text-ink">
      <div className="press-grain" />

      <header className="relative z-10 px-5 py-5">
        <Link href="/">
          <WhisprLogo markSize={24} />
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-5 pb-16">
        <div className="w-full max-w-md">
          {isEmailSent ? (
            <div className="rounded-[4px] border-2 border-ink bg-paper-2 p-8 text-center shadow-[6px_6px_0_0_var(--color-ink)]">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full border-2 border-ink bg-flame shadow-[3px_3px_0_0_var(--color-ink)]">
                <MailCheck className="size-7 text-white" />
              </span>
              <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight">Check your inbox</h1>
              <p className="mt-2 text-sm text-ink-soft">
                We sent a magic link to <span className="font-semibold text-ink">{email}</span>. Click it to sign in.
              </p>
              <p className="mt-2 font-voice text-xs text-ink-faint">no link? check spam — it lands fast.</p>
              <button
                onClick={() => setIsEmailSent(false)}
                className="mt-5 font-display text-sm font-extrabold text-ultra underline-offset-4 hover:underline"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <div className="rounded-[4px] border-2 border-ink bg-paper-2 p-7 shadow-[6px_6px_0_0_var(--color-ink)]">
              <h1 className="font-display text-3xl font-extrabold tracking-tight">Get your link.</h1>
              <p className="mt-2 text-ink-soft">Sign in or create an account — no password, just a magic link.</p>

              <form onSubmit={handleSubmit} className="mt-6">
                <label htmlFor="email" className="mb-2 block font-display text-sm font-bold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-[3px] border-2 border-ink bg-paper px-4 py-3 font-voice text-[15px] text-ink outline-none placeholder:text-ink-faint focus:ring-2 focus:ring-ultra"
                />

                {error && (
                  <p className="mt-3 rounded-[3px] border-2 border-ink bg-ember/15 px-3 py-2 text-sm font-medium text-ink">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-[3px] border-2 border-ink bg-flame px-5 py-3 font-display text-base font-extrabold text-white shadow-[5px_5px_0_0_var(--color-ink)] transition-[transform,box-shadow] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none disabled:opacity-60 disabled:shadow-[3px_3px_0_0_var(--color-ink)]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Sending link…
                    </>
                  ) : (
                    'Send magic link'
                  )}
                </button>
              </form>

              <p className="mt-6 border-t-2 border-ink/15 pt-4 text-center font-voice text-[11px] text-ink-faint">
                By continuing you agree to our{' '}
                <Link href="/terms" className="text-ultra underline-offset-2 hover:underline">
                  Terms
                </Link>{' '}
                &amp;{' '}
                <Link href="/privacy" className="text-ultra underline-offset-2 hover:underline">
                  Privacy
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

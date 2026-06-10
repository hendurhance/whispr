'use client'

import { RefreshCw, Loader2, Check, X } from 'lucide-react'
import { useProfileSetup } from '@/hooks/useProfileSetup'
import { WhisprLogo } from '@/components/brand/whispr-mark'
import { Avatar } from '@/components/ui/avatar'

export function SetupProfileForm() {
  const {
    username,
    bio,
    avatarPreview,
    isAvailable,
    isChecking,
    isSubmitting,
    error,
    handleUsernameChange,
    setBio,
    generateDefaultAvatar,
    handleSubmit,
    BIO_MAX_LENGTH,
  } = useProfileSetup()

  return (
    <div data-tier="press" className="relative flex min-h-[100dvh] flex-col bg-paper text-ink">
      <div className="press-grain" />

      <header className="relative z-10 px-5 py-5">
        <WhisprLogo markSize={24} />
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-5 pb-16">
        <div className="w-full max-w-lg">
          <div className="rounded-[4px] border-2 border-ink bg-paper-2 p-7 shadow-[6px_6px_0_0_var(--color-ink)]">
            <h1 className="font-display text-3xl font-extrabold tracking-tight">Claim your handle.</h1>
            <p className="mt-2 text-ink-soft">This becomes your link — pick something people will recognize.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="username" className="mb-2 block font-display text-sm font-bold">
                  Username
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-0 top-0 flex h-full items-center pl-4 font-voice text-[15px] text-ink-faint">@</span>
                  <input
                    id="username"
                    value={username}
                    onChange={handleUsernameChange}
                    required
                    minLength={3}
                    maxLength={20}
                    pattern="[a-zA-Z0-9_]+"
                    placeholder="yourname"
                    className="w-full rounded-[3px] border-2 border-ink bg-paper py-3 pl-9 pr-11 font-voice text-[15px] text-ink outline-none placeholder:text-ink-faint focus:ring-2 focus:ring-ultra"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isChecking ? (
                      <Loader2 className="size-4 animate-spin text-ink-faint" />
                    ) : isAvailable === true ? (
                      <Check className="size-4 text-spot-mint" />
                    ) : isAvailable === false ? (
                      <X className="size-4 text-ember" />
                    ) : null}
                  </span>
                </div>
                <p className="mt-2 font-voice text-xs text-ink-faint">
                  trywhispr.me/<span className="text-ink">{username || 'yourname'}</span>
                </p>
                {username && isAvailable === false && <p className="mt-1 text-xs font-medium text-destructive">That handle is taken or invalid.</p>}
              </div>

              <div>
                <label className="mb-2 block font-display text-sm font-bold">Avatar</label>
                <div className="flex items-center gap-4">
                  {avatarPreview ? (
                    <Avatar src={avatarPreview} size={64} className="size-16 rounded-full border-2 border-ink object-cover shadow-[3px_3px_0_0_var(--color-ink)]" />
                  ) : (
                    <span className="size-16 rounded-full border-2 border-ink bg-flame shadow-[3px_3px_0_0_var(--color-ink)]" />
                  )}
                  <button
                    type="button"
                    onClick={() => generateDefaultAvatar(Math.random().toString(36).slice(2, 10))}
                    className="inline-flex items-center gap-2 rounded-[3px] border-2 border-ink bg-paper px-4 py-2 font-display text-sm font-extrabold shadow-[3px_3px_0_0_var(--color-ink)] transition-transform active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
                  >
                    <RefreshCw className="size-4" /> Shuffle
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="mb-2 block font-display text-sm font-bold">
                  Bio <span className="font-normal text-ink-faint">(optional)</span>
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={BIO_MAX_LENGTH}
                  rows={3}
                  placeholder="a line about you"
                  className="w-full resize-none rounded-[3px] border-2 border-ink bg-paper px-4 py-3 font-voice text-[15px] text-ink outline-none placeholder:text-ink-faint focus:ring-2 focus:ring-ultra"
                />
                <p className="mt-1 text-right font-voice text-[11px] text-ink-faint">
                  {bio.length}/{BIO_MAX_LENGTH}
                </p>
              </div>

              {error && <p className="rounded-[3px] border-2 border-ink bg-ember/15 px-3 py-2 text-sm font-medium text-ink">{error}</p>}

              <button
                type="submit"
                disabled={!isAvailable || isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-[3px] border-2 border-ink bg-flame px-5 py-3 font-display text-base font-extrabold text-white shadow-[5px_5px_0_0_var(--color-ink)] transition-[transform,box-shadow] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-[3px_3px_0_0_var(--color-ink)]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Setting up…
                  </>
                ) : (
                  'Continue to dashboard →'
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

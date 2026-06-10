'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { RefreshCw, LogOut, Loader2, Check, X } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types'
import { createClient } from '@/utils/supabase/client'
import { useSetting } from '@/hooks/useSetting'
import { useEmailSettings } from '@/hooks/useEmailSettings'
import { Avatar } from '@/components/ui/avatar'
import { PushToggle } from '@/components/settings/push-toggle'
import { ThemeToggle } from '@/components/dashboard/theme-toggle'
import { APP_URL_CLEAN } from '@/configs'
import { AppShell } from '@/components/dashboard/app-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import type { ReactNode } from 'react'

interface SettingsViewProps {
  initialUser: User
  initialProfile: Profile | null
  unreadCount: number
}

export function SettingsView({ initialUser, initialProfile, unreadCount }: SettingsViewProps) {
  const s = useSetting({ initialUser, initialProfile })
  const email = useEmailSettings({
    userId: initialUser.id,
    enableNotifications: s.emailNotifications,
    onToggleNotifications: s.handleToggleNotifications,
  })

  const username = initialProfile?.username || (initialUser.user_metadata?.username as string) || 'user'
  const sidebarName = initialProfile?.display_name || username
  const sidebarAvatar = initialProfile?.avatar_url || (initialUser.user_metadata?.avatar_url as string) || ''
  const profileUrl = `${APP_URL_CLEAN}/${username}`

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const regenAvatar = () => {
    const seed = Math.random().toString(36).slice(2, 10)
    s.setAvatarUrl(`https://api.dicebear.com/9.x/personas/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`)
  }

  const signOutEverywhere = async () => {
    setSigningOut(true)
    try {
      await createClient().auth.signOut({ scope: 'global' })
      toast.success('Signed out on all devices')
    } catch {
      toast.error('Could not sign out')
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <AppShell username={username} displayName={sidebarName} avatarUrl={sidebarAvatar} profileUrl={profileUrl} unreadCount={unreadCount}>
      <header className="border-b border-border px-5 py-3.5">
        <h1 className="font-display text-xl font-bold tracking-tight text-ink">Settings</h1>
      </header>

      <div className="mx-auto w-full max-w-3xl space-y-6 px-5 py-6">
        <form onSubmit={s.handleSubmit} className="rounded-xl border border-border bg-paper p-5 shadow-sm">
          <p className="text-sm font-semibold text-ink">Profile</p>

          <div className="mt-4 flex items-center gap-4">
            {s.avatarUrl ? (
              <Avatar src={s.avatarUrl} size={64} className="size-16 rounded-full border border-border object-cover" />
            ) : (
              <span className="flex size-16 items-center justify-center rounded-full bg-secondary font-display text-xl font-bold text-ink">
                {(s.displayName || username).charAt(0).toUpperCase()}
              </span>
            )}
            <Button type="button" variant="outline" size="sm" onClick={regenAvatar}>
              <RefreshCw /> New avatar
            </Button>
          </div>

          <div className="mt-5 grid gap-4">
            <Field label="Username">
              <Input value={s.username} onChange={(e) => s.handleUsernameChange(e.target.value)} maxLength={s.USERNAME_MAX_LENGTH} placeholder="username" />
              {s.isCheckingUsername ? (
                <Hint><Loader2 className="size-3 animate-spin" /> checking…</Hint>
              ) : s.isUsernameAvailable === true ? (
                <Hint className="text-spot-mint"><Check className="size-3" /> available</Hint>
              ) : s.isUsernameAvailable === false ? (
                <Hint className="text-ember"><X className="size-3" /> taken or invalid</Hint>
              ) : null}
            </Field>

            <Field label="Display name">
              <Input value={s.displayName} onChange={(e) => s.setDisplayName(e.target.value)} placeholder="Your name" />
            </Field>

            <Field label="Bio">
              <textarea
                value={s.bio}
                onChange={(e) => s.setBio(e.target.value)}
                maxLength={s.BIO_MAX_LENGTH}
                rows={3}
                placeholder="a line about you"
                className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/35"
              />
              <Hint>{s.bio.length}/{s.BIO_MAX_LENGTH}</Hint>
            </Field>
          </div>

          {s.error && <p className="mt-4 rounded-md border border-ember/30 bg-ember/10 px-3 py-2 text-sm font-medium text-destructive">{s.error}</p>}
          {s.successMessage && <p className="mt-4 rounded-md border border-spot-mint/30 bg-spot-mint/10 px-3 py-2 text-sm font-medium text-ink">{s.successMessage}</p>}

          <Button type="submit" variant="flame" className="mt-5" disabled={s.isSubmitting}>
            {s.isSubmitting ? (
              <>
                <Loader2 className="animate-spin" /> Saving…
              </>
            ) : (
              'Save changes'
            )}
          </Button>
        </form>

        <section className="rounded-xl border border-border bg-paper p-5 shadow-sm">
          <p className="text-sm font-semibold text-ink">Email</p>
          <div className="mt-3">
            <p className="font-voice text-sm text-ink">{initialUser.email}</p>
            <p className="mt-1 text-xs text-ink-faint">Email changes aren&apos;t supported yet — contact support if you need to switch.</p>
          </div>
          <div className="mt-4 flex items-center justify-between gap-4 border-t border-border pt-4">
            <div>
              <p className="text-sm font-medium text-ink">Email notifications</p>
              <p className="text-xs text-ink-faint">Get an email when a new whispr lands.</p>
            </div>
            <Switch checked={email.notificationState} onCheckedChange={email.toggleNotifications} disabled={email.isUpdatingNotification} />
          </div>
        </section>

        <PushToggle />

        <ThemeToggle />

        <section className="rounded-xl border border-border bg-paper p-5 shadow-sm">
          <p className="text-sm font-semibold text-ink">Account</p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <p className="text-sm font-medium text-ink">Sign out everywhere</p>
              <p className="text-xs text-ink-faint">Sign out of every device.</p>
            </div>
            <Button variant="outline" size="sm" onClick={signOutEverywhere} disabled={signingOut}>
              <LogOut /> {signingOut ? 'Signing out…' : 'Sign out all'}
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-destructive">Delete account</p>
              <p className="text-xs text-ink-faint">Permanently deletes your profile and all whisprs.</p>
            </div>
            {confirmDelete ? (
              <div className="flex gap-2">
                <Button variant="destructive" size="sm" onClick={s.handleDeleteAccount} disabled={s.isDeleting}>
                  {s.isDeleting ? 'Deleting…' : 'Yes, delete'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)} disabled={s.isDeleting}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="border-ember/40 text-ember hover:bg-ember/10" onClick={() => setConfirmDelete(true)}>
                Delete…
              </Button>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-ink">{label}</label>
      {children}
    </div>
  )
}

function Hint({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={`flex items-center gap-1 font-voice text-[11px] text-ink-faint ${className ?? ''}`}>{children}</span>
}

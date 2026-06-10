'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'react-hot-toast'
import { Copy, Share2, ExternalLink, Download, Trash2, Plus } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types'
import { getUsernameLink } from '@/hooks/getUsernameLink'
import { useShareLink } from '@/hooks/useShareLink'
import { useQRCode } from '@/hooks/useQRCode'
import { useSocialLinks } from '@/hooks/useSocialLinks'
import { useProfileSettings } from '@/hooks/useProfileSettings'
import { AppShell } from '@/components/dashboard/app-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { ACCENTS, ACCENT_IDS } from '@/lib/accents'
import { WHISPR_MARK_PATH, WHISPR_MARK_DATA_URI } from '@/lib/brand'

interface YourLinkViewProps {
  initialUser: User
  initialProfile: Profile | null
  unreadCount: number
}

export function YourLinkView({ initialUser, initialProfile, unreadCount }: YourLinkViewProps) {
  const router = useRouter()
  const username = initialProfile?.username || (initialUser.user_metadata?.username as string) || 'user'
  const displayName = initialProfile?.display_name || username
  const avatarUrl = initialProfile?.avatar_url || (initialUser.user_metadata?.avatar_url as string) || ''
  const profileUrl = getUsernameLink(username)

  const { copyToClipboard, shareLink } = useShareLink()
  const { qrSize, qrCodeRef, downloadQRCode } = useQRCode(180)
  const social = useSocialLinks()
  const profileSettings = useProfileSettings(initialProfile, initialUser, async () => {
    router.refresh()
  })

  const [platform, setPlatform] = useState('instagram')
  const [url, setUrl] = useState('')

  const addLink = async () => {
    const ok = await social.addSocialLink(platform, url)
    if (ok) {
      setUrl('')
      toast.success('Link added')
    }
  }

  const drawQrLogo = (ctx: CanvasRenderingContext2D, { width, height, qrSize }: { width: number; height: number; qrSize: number }) => {
    const size = qrSize * 0.26
    const x = (width - size) / 2
    const y = (height - size) / 2
    const pad = size * 0.14
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.roundRect(x - pad, y - pad, size + pad * 2, size + pad * 2, 10)
    ctx.fill()
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(size / 370, size / 370)
    ctx.fillStyle = '#0a0a0a'
    ctx.beginPath()
    ctx.roundRect(0, 0, 370, 370, 50)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.fill(new Path2D(WHISPR_MARK_PATH))
    ctx.restore()
  }

  return (
    <AppShell username={username} displayName={displayName} avatarUrl={avatarUrl} profileUrl={profileUrl} unreadCount={unreadCount}>
      <header className="border-b border-border px-5 py-3.5">
        <h1 className="font-display text-xl font-bold tracking-tight text-ink">Your link</h1>
      </header>

      <div className="mx-auto w-full max-w-3xl space-y-6 px-5 py-6">
        <section className="rounded-xl border border-border bg-paper p-5 shadow-sm">
          <p className="text-sm font-semibold text-ink">Your public link</p>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center rounded-lg border border-border bg-muted px-3 py-3 font-voice text-sm text-ink">
                <span className="truncate">{profileUrl}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="flame"
                  size="sm"
                  onClick={async () => {
                    await copyToClipboard(profileUrl)
                    toast.success('Link copied')
                  }}
                >
                  <Copy /> Copy
                </Button>
                <Button variant="outline" size="sm" onClick={() => shareLink(profileUrl, { title: 'Send me anonymous messages' })}>
                  <Share2 /> Share
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://${profileUrl}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink /> Open
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-center gap-2">
              <div className="rounded-lg border border-border bg-white p-2.5">
                <QRCodeSVG
                  ref={qrCodeRef}
                  value={`https://${profileUrl}`}
                  size={qrSize}
                  level="H"
                  imageSettings={{ src: WHISPR_MARK_DATA_URI, height: qrSize * 0.26, width: qrSize * 0.26, excavate: true }}
                />
              </div>
              <Button variant="ghost" size="sm" onClick={() => downloadQRCode(`${username}-whispr-qr.png`, { drawOverlay: drawQrLogo })}>
                <Download /> Save QR
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-paper p-5 shadow-sm">
          <p className="text-sm font-semibold text-ink">Controls</p>
          <div className="mt-4 space-y-4">
            <ToggleRow
              title="Accept anonymous messages"
              desc="Turn your inbox on or off for new whisprs."
              checked={profileSettings.settings.allowAnonymous}
              onToggle={profileSettings.toggleSetting('allowAnonymous', 'allow_anonymous')}
            />
            <ToggleRow
              title="Show social links"
              desc="Display your socials on your public page."
              checked={profileSettings.settings.displaySocialLinks}
              onToggle={profileSettings.toggleSetting('displaySocialLinks', 'display_social_links')}
            />
            <ToggleRow
              title="Show in search engines"
              desc="Let Google and others list your public page. Turn off to hide it from search."
              checked={profileSettings.settings.isIndexable}
              onToggle={profileSettings.toggleSetting('isIndexable', 'is_indexable')}
            />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-paper p-5 shadow-sm">
          <p className="text-sm font-semibold text-ink">Appearance</p>
          <p className="mt-1 text-xs text-ink-faint">Personalize your public page and share card — stays on-brand.</p>

          <p className="mt-4 text-xs font-medium text-ink-soft">Accent ink</p>
          <div className="mt-2 flex flex-wrap gap-2.5">
            {ACCENT_IDS.map((id) => {
              const a = ACCENTS[id]
              const active = profileSettings.settings.selectedTheme === id
              return (
                <button
                  key={id}
                  type="button"
                  title={a.label}
                  aria-label={a.label}
                  onClick={() => profileSettings.handleThemeChange(id)}
                  className={cn('size-9 rounded-full border-2 transition-transform', active ? 'scale-110 border-ink' : 'border-border hover:scale-105')}
                  style={{ backgroundColor: a.hex }}
                />
              )
            })}
          </div>

          <p className="mt-5 text-xs font-medium text-ink-soft">Paper</p>
          <div className="mt-2 grid max-w-xs grid-cols-2 gap-2">
            {(['light', 'dark'] as const).map((m) => {
              const active = profileSettings.settings.selectedBackground === m
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => profileSettings.handleBackgroundChange(m)}
                  className={cn(
                    'rounded-md border px-3 py-2 text-xs font-semibold transition-colors',
                    active ? 'border-flame bg-flame/10 text-flame-ink' : 'border-border bg-paper text-ink-faint hover:bg-secondary hover:text-ink',
                  )}
                >
                  {m === 'light' ? 'Daylight' : 'After Hours'}
                </button>
              )
            })}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-paper p-5 shadow-sm">
          <p className="text-sm font-semibold text-ink">Social links</p>
          <p className="mt-1 text-xs text-ink-faint">Up to 10, one per platform. Shown on your page when “Show social links” is on.</p>

          {social.socialLinks.length > 0 && (
            <div className="mt-4 space-y-2">
              {social.socialLinks.map((l) => (
                <div key={l.id} className="flex items-center gap-3 rounded-lg border border-border bg-muted px-3 py-2.5">
                  <span className="text-sm font-medium capitalize text-ink">{social.getPlatformName(l.platform)}</span>
                  <span className="min-w-0 flex-1 truncate font-voice text-xs text-ink-faint">{l.url}</span>
                  <button
                    onClick={() => social.deleteSocialLink(l.id)}
                    className="flex size-7 shrink-0 items-center justify-center rounded-md text-ink-faint transition-colors hover:bg-paper hover:text-ember"
                    title="Remove"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/35 sm:w-40"
            >
              {social.platformOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className="flex-1" />
            <Button variant="outline" onClick={addLink} disabled={social.isLoading}>
              <Plus /> Add
            </Button>
          </div>

          {social.error && <p className="mt-3 text-sm font-medium text-destructive">{social.error}</p>}
        </section>
      </div>
    </AppShell>
  )
}

function ToggleRow({ title, desc, checked, onToggle }: { title: string; desc: string; checked: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="text-xs text-ink-faint">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onToggle} />
    </div>
  )
}

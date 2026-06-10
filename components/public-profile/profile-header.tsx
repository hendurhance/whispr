import { Sparkle } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'

export interface PublicSocialLink {
  id: string
  platform: string
  url: string
}

interface ProfileHeaderProps {
  username: string
  displayName: string | null
  avatarUrl: string | null
  bio: string | null
  totalWhisprs: number
  displaySocialLinks: boolean
  socialLinks: PublicSocialLink[]
  allowAnonymous: boolean
}

export function ProfileHeader({
  username,
  displayName,
  avatarUrl,
  bio,
  totalWhisprs,
  displaySocialLinks,
  socialLinks,
  allowAnonymous,
}: ProfileHeaderProps) {
  const name = displayName || username

  return (
    <div className="mb-5 rounded-[4px] border-2 border-ink bg-paper-2 p-5 shadow-[6px_6px_0_0_var(--color-ink)]">
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <span className="inline-flex shrink-0 rounded-full bg-[var(--accent)] p-1 shadow-[3px_3px_0_0_var(--color-ink)]">
            <Avatar src={avatarUrl} alt={name} size={64} className="size-16 rounded-full border-2 border-ink bg-paper object-cover" />
          </span>
        ) : (
          <span className="flex size-[70px] shrink-0 items-center justify-center rounded-full border-2 border-ink bg-[var(--accent)] font-display text-2xl font-extrabold text-[var(--accent-fg)] shadow-[3px_3px_0_0_var(--color-ink)]">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-extrabold leading-none tracking-tight text-ink">{name}</h1>
          <p className="mt-1.5 font-voice text-xs text-ink-faint">@{username}</p>
        </div>
      </div>

      {bio && <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{bio}</p>}

      <div className="mt-4 inline-flex items-center gap-1.5 rounded-[3px] border-2 border-ink bg-[var(--accent)] px-2.5 py-1 font-voice text-[11px] font-bold text-[var(--accent-fg)]">
        <Sparkle className="size-3 shrink-0" />
        {totalWhisprs} {totalWhisprs === 1 ? 'whispr' : 'whisprs'} received
      </div>

      {!allowAnonymous && (
        <div className="mt-5 rounded-[3px] border-2 border-dashed border-ink/40 bg-paper p-4 text-center">
          <p className="font-display text-sm font-bold text-ink">Anonymous messages are off</p>
          <p className="mt-1 text-xs text-ink-faint">{name} isn&apos;t accepting whisprs right now.</p>
        </div>
      )}

      {displaySocialLinks && socialLinks.length > 0 && (
        <div className="mt-5">
          <h2 className="mb-2 font-voice text-[10px] uppercase tracking-[0.18em] text-ink-faint">Connect with me</h2>
          <div className="flex flex-wrap gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-ink bg-paper px-3 py-1 text-xs font-semibold capitalize text-ink-soft transition-transform hover:-translate-y-0.5"
              >
                {link.platform}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

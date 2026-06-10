'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { toast } from 'react-hot-toast'
import { Search, Copy, X } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types'
import { type Whispr, type WhisprType, type WhisprStats, getWhisprTypeLabel } from '@/types/whispr'
import { markWhisprAsRead, deleteWhisprById, reportWhisprById } from '@/lib/client/whisprs'
import { useWhisprFiltering } from '@/hooks/useWhisprFiltering'
import { useInboxPolling } from '@/hooks/useInboxPolling'
import { downloadShareCard, shareShareCard } from '@/lib/client/share-card'
import { APP_URL_CLEAN } from '@/configs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DashboardSidebar } from './dashboard-sidebar'
import { WhisprRow } from './whispr-row'
import { ShareStudio } from './share-studio'
import { MobileTabBar } from './mobile-tab-bar'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { ReportDialog } from '@/components/ui/report-dialog'
import { AppBadge } from '@/components/pwa/app-badge'

interface DashboardProps {
  initialWhisprs: Array<{
    id: string
    content: string
    type: string
    created_at: string
    is_read: boolean
    metadata?: Record<string, unknown>
  }>
  initialUser: User
  initialProfile: Profile | null
}

export function Dashboard({ initialWhisprs, initialUser, initialProfile }: DashboardProps) {
  const username = initialProfile?.username || (initialUser?.user_metadata?.username as string) || 'user'
  const displayName = initialProfile?.display_name || (initialUser?.user_metadata?.username as string) || 'there'
  const avatarUrl = initialProfile?.avatar_url || (initialUser?.user_metadata?.avatar_url as string) || ''
  const profileUrl = `${APP_URL_CLEAN}/${username}`
  const accentInk = initialProfile?.selected_theme || 'flame'
  const paperMode = initialProfile?.selected_background || 'light'

  const [whisprs, setWhisprs] = useState<Whispr[]>(() =>
    initialWhisprs.map((w) => ({
      id: w.id,
      content: w.content,
      type: w.type as WhisprType,
      createdAt: w.created_at,
      isRead: w.is_read,
      metadata: w.metadata || {},
    })),
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const stats = useMemo<WhisprStats>(() => {
    const byType = whisprs.reduce((acc, w) => {
      acc[w.type] = (acc[w.type] || 0) + 1
      return acc
    }, {} as Record<WhisprType, number>)
    return { total: whisprs.length, unread: whisprs.filter((w) => !w.isRead).length, byType }
  }, [whisprs])

  const { selectedType, setSelectedType, searchTerm, setSearchTerm, filteredWhisprs, resetFilters, isFiltered } =
    useWhisprFiltering({ whisprs })

  useInboxPolling(initialUser?.id ?? '', (latest) => {
    const knownIds = new Set(whisprs.map((w) => w.id))
    const fresh = latest.filter((w) => !knownIds.has(w.id))
    if (fresh.length === 0) return
    toast.success(fresh.length === 1 ? 'New whispr just landed' : `${fresh.length} new whisprs landed`)
    setWhisprs((prev) => {
      const prevIds = new Set(prev.map((w) => w.id))
      const toAdd = fresh.filter((w) => !prevIds.has(w.id))
      if (toAdd.length === 0) return prev
      return [...toAdd, ...prev].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    })
  })

  const [busy, setBusy] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Whispr | null>(null)
  const [pendingReport, setPendingReport] = useState<Whispr | null>(null)

  const selected = whisprs.find((w) => w.id === selectedId) ?? null

  const markRead = async (w: Whispr) => {
    if (w.isRead) return
    if (await markWhisprAsRead(w.id)) {
      setWhisprs((prev) => prev.map((x) => (x.id === w.id ? { ...x, isRead: true } : x)))
    }
  }

  const requestDelete = (w: Whispr) => setPendingDelete(w)
  const confirmDelete = async () => {
    const w = pendingDelete
    if (!w) return
    if (await deleteWhisprById(w.id)) {
      setWhisprs((prev) => prev.filter((x) => x.id !== w.id))
      setSelectedId((id) => (id === w.id ? null : id))
      toast.success('Whispr deleted')
    }
    setPendingDelete(null)
  }

  const requestReport = (w: Whispr) => setPendingReport(w)
  const confirmReport = async (reason: string) => {
    const w = pendingReport
    if (!w) return
    if (await reportWhisprById(w.id, reason)) {
      setWhisprs((prev) => prev.filter((x) => x.id !== w.id))
      setSelectedId((id) => (id === w.id ? null : id))
      toast.success('Reported — we’ll take a look')
    }
    setPendingReport(null)
  }

  const select = (w: Whispr) => {
    setSelectedId(w.id)
    void markRead(w)
  }
  const share = async (w: Whispr, fmt: 'square' | 'story' = 'story') => {
    void markRead(w)
    setBusy(true)
    try {
      await shareShareCard(w, username, fmt, accentInk, paperMode)
    } finally {
      setBusy(false)
    }
  }
  const download = async (w: Whispr, fmt: 'square' | 'story' = 'square') => {
    setBusy(true)
    try {
      await downloadShareCard(w, username, fmt, accentInk, paperMode)
    } finally {
      setBusy(false)
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://${profileUrl}`)
      toast.success('Link copied')
    } catch {
      toast.error('Could not copy')
    }
  }

  const filterTypes = useMemo(() => Object.keys(stats.byType) as WhisprType[], [stats.byType])

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background text-foreground">
      <AppBadge count={stats.unread} />
      <DashboardSidebar
        username={username}
        displayName={displayName}
        avatarUrl={avatarUrl}
        profileUrl={profileUrl}
        unreadCount={stats.unread}
      />

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3.5">
          <h1 className="shrink-0 font-display text-xl font-bold tracking-tight text-ink">Inbox</h1>
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search whisprs…"
              className="pl-9"
              aria-label="Search whisprs"
            />
          </div>
          <Button variant="flame" className="ml-auto" onClick={copyLink}>
            <Copy /> Copy your link
          </Button>
        </header>

        <div className="grid min-h-0 flex-1 overflow-hidden xl:grid-cols-[1fr_360px]">
          <section className="min-w-0 overflow-y-auto px-5 py-5 pb-24 lg:pb-5">
            <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatTile label="Total whisprs" value={stats.total} />
              <StatTile label="Unread" value={stats.unread} />
              <StatTile label="Profile views" value={initialProfile?.total_views ?? 0} />
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-1.5">
              <FilterChip active={selectedType === 'all'} onClick={() => setSelectedType('all')}>
                All
              </FilterChip>
              {filterTypes.map((t) => (
                <FilterChip key={t} active={selectedType === t} onClick={() => setSelectedType(t)}>
                  {getWhisprTypeLabel(t)}
                </FilterChip>
              ))}
            </div>

            {filteredWhisprs.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-border bg-paper shadow-sm">
                {filteredWhisprs.map((w) => (
                  <WhisprRow
                    key={w.id}
                    whispr={w}
                    selected={w.id === selectedId}
                    busy={busy}
                    onSelect={select}
                    onShare={share}
                    onMarkRead={markRead}
                    onDelete={requestDelete}
                    onReport={requestReport}
                  />
                ))}
              </div>
            ) : (
              <EmptyState isFiltered={isFiltered} onReset={resetFilters} profileUrl={profileUrl} onCopy={copyLink} />
            )}
          </section>

          <aside className="hidden overflow-y-auto border-l border-border bg-paper xl:block">
            <ShareStudio
              whispr={selected}
              handle={username}
              accent={accentInk}
              mode={paperMode}
              busy={busy}
              onDownload={download}
              onShare={share}
              onMarkRead={markRead}
              onDelete={requestDelete}
              onReport={requestReport}
            />
          </aside>
        </div>
      </main>

      {selected && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button className="absolute inset-0 bg-black/40" onClick={() => setSelectedId(null)} aria-label="Close" tabIndex={-1} />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-2xl border-t-2 border-border bg-paper">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-display text-sm font-bold text-ink">Share studio</span>
              <button
                onClick={() => setSelectedId(null)}
                className="flex size-8 items-center justify-center rounded-md text-ink-faint transition-colors hover:bg-secondary hover:text-ink"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="overflow-y-auto">
              <ShareStudio
                whispr={selected}
                handle={username}
                accent={accentInk}
                mode={paperMode}
                busy={busy}
                onDownload={download}
                onShare={share}
                onMarkRead={markRead}
                onDelete={requestDelete}
                onReport={requestReport}
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this whispr?"
        description="This permanently removes it from your inbox and can't be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <ReportDialog open={!!pendingReport} onConfirm={confirmReport} onCancel={() => setPendingReport(null)} />

      <MobileTabBar />
    </div>
  )
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-paper p-4">
      <p className="text-xs font-medium text-ink-faint">{label}</p>
      <p className="mt-1.5 font-display text-2xl font-bold tracking-tight text-ink tabular-nums">{value.toLocaleString()}</p>
    </div>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'min-h-8 rounded-full border px-3 text-[13px] font-medium transition-colors',
        active ? 'border-flame/30 bg-flame/10 text-flame-ink' : 'border-border bg-paper text-ink-faint hover:bg-secondary hover:text-ink',
      )}
    >
      {children}
    </button>
  )
}

function EmptyState({
  isFiltered,
  onReset,
  profileUrl,
  onCopy,
}: {
  isFiltered: boolean
  onReset: () => void
  profileUrl: string
  onCopy: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-paper px-6 py-16 text-center">
      <p className="font-display text-lg font-semibold text-ink">{isFiltered ? 'No whisprs match' : 'Your inbox is empty'}</p>
      <p className="mt-1.5 max-w-sm text-sm text-ink-faint">
        {isFiltered ? 'Try clearing your filters.' : `Share ${profileUrl} and anonymous whisprs will land right here.`}
      </p>
      {isFiltered ? (
        <Button variant="outline" className="mt-5" onClick={onReset}>
          Clear filters
        </Button>
      ) : (
        <Button variant="flame" className="mt-5" onClick={onCopy}>
          <Copy /> Copy your link
        </Button>
      )}
    </div>
  )
}

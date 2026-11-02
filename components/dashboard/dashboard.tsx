'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { toast } from 'react-hot-toast'
import { Search, Copy, X, MessageCircleQuestion } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types'
import { type Whispr, type WhisprType, type WhisprStats, getWhisprTypeLabel } from '@/types/whispr'
import { markWhisprAsRead, reportWhisprById, saveWhisprAnswer } from '@/lib/client/whisprs'
import { useInbox, UNDO_WINDOW_MS } from '@/hooks/useInbox'
import { downloadShareCard, shareShareCard } from '@/lib/client/share-card'
import { APP_URL_CLEAN } from '@/configs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DashboardSidebar } from './dashboard-sidebar'
import { WhisprRow } from './whispr-row'
import { ShareStudio } from './share-studio'
import { PromptStudio } from './prompt-studio'
import { MobileTabBar } from './mobile-tab-bar'
import { ReportDialog } from '@/components/ui/report-dialog'
import { AppBadge } from '@/components/pwa/app-badge'

interface DashboardProps {
  initialWhisprs: Whispr[]
  initialStats: WhisprStats
  initialUser: User
  initialProfile: Profile | null
}

export function Dashboard({ initialWhisprs, initialStats, initialUser, initialProfile }: DashboardProps) {
  const username = initialProfile?.username || (initialUser?.user_metadata?.username as string) || 'user'
  const displayName = initialProfile?.display_name || (initialUser?.user_metadata?.username as string) || 'there'
  const avatarUrl = initialProfile?.avatar_url || (initialUser?.user_metadata?.avatar_url as string) || ''
  const profileUrl = `${APP_URL_CLEAN}/${username}`

  const [selectedId, setSelectedId] = useState<string | null>(null)

  const {
    whisprs,
    stats,
    hasMore,
    isLoading,
    selectedType,
    setSelectedType,
    searchTerm,
    setSearchTerm,
    resetFilters,
    isFiltered,
    loadMore,
    markReadLocal,
    removeLocal,
    scheduleDelete,
    setAnswerLocal,
  } = useInbox({ userId: initialUser.id, initialWhisprs, initialStats })

  const [busy, setBusy] = useState(false)
  const [isPromptOpen, setIsPromptOpen] = useState(false)
  const [pendingReport, setPendingReport] = useState<Whispr | null>(null)

  const selected = whisprs.find((w) => w.id === selectedId) ?? null

  const markRead = async (w: Whispr) => {
    if (w.isRead) return
    if (await markWhisprAsRead(w.id)) markReadLocal(w.id)
  }

  const deleteWithUndo = (w: Whispr) => {
    const undo = scheduleDelete(w)
    setSelectedId((id) => (id === w.id ? null : id))
    toast(
      (t) => (
        <span className="flex items-center gap-3">
          Whispr deleted
          <button
            className="font-semibold underline underline-offset-4"
            onClick={() => {
              toast.dismiss(t.id)
              if (!undo()) toast.error('Already deleted')
            }}
          >
            Undo
          </button>
        </span>
      ),
      { duration: UNDO_WINDOW_MS },
    )
  }

  const saveAnswer = async (w: Whispr, answer: string) => {
    const isSaved = await saveWhisprAnswer(w.id, answer)
    if (isSaved) setAnswerLocal(w.id, answer || null)
    return isSaved
  }

  const requestReport = (w: Whispr) => setPendingReport(w)
  const confirmReport = async (reason: string) => {
    const w = pendingReport
    if (!w) return
    if (await reportWhisprById(w.id, reason)) {
      removeLocal(w)
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
      await shareShareCard(w, fmt)
    } finally {
      setBusy(false)
    }
  }
  const download = async (w: Whispr, fmt: 'square' | 'story' = 'square') => {
    setBusy(true)
    try {
      await downloadShareCard(w, fmt)
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
          <div className="ml-auto flex gap-2">
            <Button variant="outline" className="xl:hidden" onClick={() => setIsPromptOpen(true)}>
              <MessageCircleQuestion /> Ask followers
            </Button>
            <Button variant="flame" onClick={copyLink}>
              <Copy /> Copy your link
            </Button>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 overflow-hidden xl:grid-cols-[1fr_360px]">
          <section className="min-w-0 overflow-y-auto px-5 py-5 pb-24 lg:pb-5">
            <p className="mb-4 flex flex-wrap gap-x-3 gap-y-1 text-sm text-ink-faint">
              <Stat value={stats.unread} label="unread" isEmphasized={stats.unread > 0} />
              <span aria-hidden="true">·</span>
              <Stat value={stats.total} label="total" />
              <span aria-hidden="true">·</span>
              <Stat value={initialProfile?.total_views ?? 0} label="profile views" />
            </p>

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

            {whisprs.length > 0 ? (
              <div
                className={cn(
                  'overflow-hidden rounded-xl border border-border bg-paper shadow-sm transition-opacity',
                  isLoading && 'opacity-60',
                )}
                aria-busy={isLoading}
              >
                {whisprs.map((w) => (
                  <WhisprRow
                    key={w.id}
                    whispr={w}
                    selected={w.id === selectedId}
                    busy={busy}
                    onSelect={select}
                    onShare={share}
                    onMarkRead={markRead}
                    onDelete={deleteWithUndo}
                    onReport={requestReport}
                  />
                ))}
              </div>
            ) : (
              !isLoading && <EmptyState isFiltered={isFiltered} onReset={resetFilters} profileUrl={profileUrl} onCopy={copyLink} />
            )}

            {hasMore && whisprs.length > 0 && (
              <div className="mt-4 flex justify-center">
                <Button variant="outline" onClick={loadMore} disabled={isLoading}>
                  {isLoading ? 'Loading…' : 'Load older whisprs'}
                </Button>
              </div>
            )}
          </section>

          <aside className="hidden overflow-y-auto border-l border-border bg-paper xl:block">
            {selected ? (
              <ShareStudio
                key={selected.id}
                whispr={selected}
                busy={busy}
                onDownload={download}
                onShare={share}
                onMarkRead={markRead}
                onDelete={deleteWithUndo}
                onReport={requestReport}
                onSaveAnswer={saveAnswer}
              />
            ) : (
              <PromptStudio profileUrl={profileUrl} />
            )}
          </aside>
        </div>
      </main>

      {selected && (
        <BottomSheet title="Share studio" onClose={() => setSelectedId(null)}>
          <ShareStudio
            key={selected.id}
            whispr={selected}
            busy={busy}
            onDownload={download}
            onShare={share}
            onMarkRead={markRead}
            onDelete={deleteWithUndo}
            onReport={requestReport}
            onSaveAnswer={saveAnswer}
          />
        </BottomSheet>
      )}

      {isPromptOpen && (
        <BottomSheet title="Ask your followers" onClose={() => setIsPromptOpen(false)}>
          <PromptStudio profileUrl={profileUrl} />
        </BottomSheet>
      )}

      <ReportDialog open={!!pendingReport} onConfirm={confirmReport} onCancel={() => setPendingReport(null)} />

      <MobileTabBar />
    </div>
  )
}

function BottomSheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 xl:hidden" role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close" tabIndex={-1} />
      <div className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-2xl border-t-2 border-border bg-paper">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="font-display text-sm font-bold text-ink">{title}</span>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-md text-ink-faint transition-colors hover:bg-secondary hover:text-ink"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

function Stat({ value, label, isEmphasized }: { value: number; label: string; isEmphasized?: boolean }) {
  return (
    <span>
      <span className={cn('font-semibold tabular-nums', isEmphasized ? 'text-flame-ink' : 'text-ink')}>{value.toLocaleString()}</span> {label}
    </span>
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

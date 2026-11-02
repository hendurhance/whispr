import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { createClient } from '@/utils/supabase/client'
import { deleteWhisprById } from '@/lib/client/whisprs'
import { INBOX_PAGE_SIZE, WHISPR_COLUMNS, escapeLikePattern, toWhispr, type WhisprRecord } from '@/lib/inbox'
import type { Whispr, WhisprStats, WhisprType } from '@/types/whispr'

const POLL_INTERVAL_MS = 25000
const SEARCH_DEBOUNCE_MS = 300
export const UNDO_WINDOW_MS = 5000

export function useInbox({ userId, initialWhisprs, initialStats }: UseInboxProps) {
  const [whisprs, setWhisprs] = useState(initialWhisprs)
  const [stats, setStats] = useState(initialStats)
  const [hasMore, setHasMore] = useState(initialWhisprs.length === INBOX_PAGE_SIZE)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedType, setSelectedTypeState] = useState<TypeFilter>('all')
  const [searchTerm, setSearchTermState] = useState('')

  const requestIdRef = useRef(0)
  const appliedQueryRef = useRef<InboxQuery>({ type: 'all', term: '' })
  const newestCreatedAtRef = useRef(initialWhisprs[0]?.createdAt ?? new Date(0).toISOString())
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const pendingDeletesRef = useRef(new Map<string, PendingDelete>())

  const withoutPendingDeletes = (list: Whispr[]) => list.filter((w) => !pendingDeletesRef.current.has(w.id))

  const runQuery = useCallback(
    async (query: InboxQuery) => {
      const requestId = ++requestIdRef.current
      appliedQueryRef.current = query
      setIsLoading(true)
      try {
        const page = await fetchInboxPage({ userId, ...query })
        if (requestId !== requestIdRef.current) return
        setWhisprs(withoutPendingDeletes(page))
        setHasMore(page.length === INBOX_PAGE_SIZE)
      } catch {
        if (requestId === requestIdRef.current) toast.error('Could not load whisprs. Check your connection and try again.')
      } finally {
        if (requestId === requestIdRef.current) setIsLoading(false)
      }
    },
    [userId],
  )

  const setSelectedType = (type: TypeFilter) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    setSelectedTypeState(type)
    void runQuery({ type, term: searchTerm.trim() })
  }

  const setSearchTerm = (value: string) => {
    setSearchTermState(value)
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    searchTimerRef.current = setTimeout(() => {
      void runQuery({ type: selectedType, term: value.trim() })
    }, SEARCH_DEBOUNCE_MS)
  }

  const resetFilters = () => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    setSelectedTypeState('all')
    setSearchTermState('')
    void runQuery({ type: 'all', term: '' })
  }

  const loadMore = async () => {
    const oldest = whisprs.at(-1)
    if (!oldest || isLoading) return
    const requestId = requestIdRef.current
    setIsLoading(true)
    try {
      const page = await fetchInboxPage({ userId, ...appliedQueryRef.current, before: oldest.createdAt })
      if (requestId !== requestIdRef.current) return
      setWhisprs((prev) => [...prev, ...withoutPendingDeletes(page)])
      setHasMore(page.length === INBOX_PAGE_SIZE)
    } catch {
      if (requestId === requestIdRef.current) toast.error('Could not load more whisprs. Try again.')
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false)
    }
  }

  const markReadLocal = (id: string) => {
    setWhisprs((prev) => prev.map((w) => (w.id === id ? { ...w, isRead: true } : w)))
    setStats((prev) => ({ ...prev, unread: Math.max(prev.unread - 1, 0) }))
  }

  const removeLocal = (whispr: Whispr) => {
    setWhisprs((prev) => prev.filter((w) => w.id !== whispr.id))
    setStats((prev) => applyToStats(prev, [whispr], -1))
  }

  const restoreLocal = useCallback((whispr: Whispr) => {
    setWhisprs((prev) => {
      if (prev.some((w) => w.id === whispr.id)) return prev
      const index = prev.findIndex((w) => w.createdAt < whispr.createdAt)
      return index === -1 ? [...prev, whispr] : [...prev.slice(0, index), whispr, ...prev.slice(index)]
    })
    setStats((prev) => applyToStats(prev, [whispr], 1))
  }, [])

  const commitDelete = useCallback(
    async (id: string) => {
      const pending = pendingDeletesRef.current.get(id)
      if (!pending || pending.isCommitting) return
      clearTimeout(pending.timer)
      pending.isCommitting = true
      const isDeleted = await deleteWhisprById(id)
      pendingDeletesRef.current.delete(id)
      if (!isDeleted) restoreLocal(pending.whispr)
    },
    [restoreLocal],
  )

  const scheduleDelete = (whispr: Whispr): (() => boolean) => {
    removeLocal(whispr)
    const timer = setTimeout(() => void commitDelete(whispr.id), UNDO_WINDOW_MS)
    pendingDeletesRef.current.set(whispr.id, { whispr, timer, isCommitting: false })
    return () => {
      const pending = pendingDeletesRef.current.get(whispr.id)
      if (!pending || pending.isCommitting) return false
      clearTimeout(pending.timer)
      pendingDeletesRef.current.delete(whispr.id)
      restoreLocal(whispr)
      return true
    }
  }

  useEffect(() => {
    const pendingDeletes = pendingDeletesRef.current
    const flush = () => pendingDeletes.forEach((_, id) => void commitDelete(id))
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      flush()
    }
  }, [commitDelete])

  const setAnswerLocal = (id: string, answer: string | null) => {
    setWhisprs((prev) => prev.map((w) => (w.id === id ? { ...w, answer } : w)))
  }

  useEffect(() => {
    if (!userId) return
    const supabase = createClient()
    let stopped = false

    const poll = async () => {
      if (stopped || document.visibilityState !== 'visible') return
      const { data, error } = await supabase
        .from('whisprs')
        .select(WHISPR_COLUMNS)
        .eq('user_id', userId)
        .eq('status', 'active')
        .gt('created_at', newestCreatedAtRef.current)
        .order('created_at', { ascending: false })
        .limit(INBOX_PAGE_SIZE)
      if (error || !data || data.length === 0 || stopped) return

      const fresh = (data as WhisprRecord[]).map(toWhispr)
      newestCreatedAtRef.current = fresh[0].createdAt
      toast.success(fresh.length === 1 ? 'New whispr just landed' : `${fresh.length} new whisprs landed`)
      setStats((prev) => applyToStats(prev, fresh, 1))

      const visible = fresh.filter((w) => matchesQuery(w, appliedQueryRef.current))
      if (visible.length === 0) return
      setWhisprs((prev) => {
        const knownIds = new Set(prev.map((w) => w.id))
        const toAdd = visible.filter((w) => !knownIds.has(w.id))
        return toAdd.length === 0 ? prev : [...toAdd, ...prev]
      })
    }

    const interval = setInterval(poll, POLL_INTERVAL_MS)
    const onVisible = () => {
      if (document.visibilityState === 'visible') void poll()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      stopped = true
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [userId])

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    }
  }, [])

  return {
    whisprs,
    stats,
    hasMore,
    isLoading,
    selectedType,
    setSelectedType,
    searchTerm,
    setSearchTerm,
    resetFilters,
    isFiltered: searchTerm.trim() !== '' || selectedType !== 'all',
    loadMore,
    markReadLocal,
    removeLocal,
    scheduleDelete,
    setAnswerLocal,
  }
}

async function fetchInboxPage({ userId, type, term, before }: FetchInboxPageInput): Promise<Whispr[]> {
  let query = createClient()
    .from('whisprs')
    .select(WHISPR_COLUMNS)
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(INBOX_PAGE_SIZE)
  if (type !== 'all') query = query.eq('type', type)
  if (term) query = query.ilike('content', `%${escapeLikePattern(term)}%`)
  if (before) query = query.lt('created_at', before)

  const { data, error } = await query
  if (error) throw new Error('Could not load whisprs')
  return (data as WhisprRecord[]).map(toWhispr)
}

function matchesQuery(whispr: Whispr, { type, term }: InboxQuery): boolean {
  if (type !== 'all' && whispr.type !== type) return false
  return !term || whispr.content.toLowerCase().includes(term.toLowerCase())
}

function applyToStats(stats: WhisprStats, changed: Whispr[], direction: 1 | -1): WhisprStats {
  const byType = { ...stats.byType }
  let unread = stats.unread
  for (const w of changed) {
    const count = (byType[w.type] ?? 0) + direction
    if (count > 0) byType[w.type] = count
    else delete byType[w.type]
    if (!w.isRead) unread += direction
  }
  return {
    total: Math.max(stats.total + direction * changed.length, 0),
    unread: Math.max(unread, 0),
    byType,
  }
}

type TypeFilter = WhisprType | 'all'

interface InboxQuery {
  type: TypeFilter
  term: string
}

interface FetchInboxPageInput extends InboxQuery {
  userId: string
  before?: string
}

interface PendingDelete {
  whispr: Whispr
  timer: ReturnType<typeof setTimeout>
  isCommitting: boolean
}

interface UseInboxProps {
  userId: string
  initialWhisprs: Whispr[]
  initialStats: WhisprStats
}

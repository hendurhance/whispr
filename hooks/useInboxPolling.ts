import { useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { Whispr, WhisprType } from '@/types/whispr'

const POLL_INTERVAL_MS = 25000

interface PollRow {
  id: string
  content: string
  type: string
  created_at: string
  is_read: boolean
  metadata: Record<string, unknown> | null
}

export function useInboxPolling(userId: string, onFetch: (whisprs: Whispr[]) => void) {
  const onFetchRef = useRef(onFetch)
  onFetchRef.current = onFetch

  useEffect(() => {
    if (!userId) return
    const supabase = createClient()
    let stopped = false

    const poll = async () => {
      if (stopped || document.visibilityState !== 'visible') return
      const { data, error } = await supabase
        .from('whisprs')
        .select('id, content, type, created_at, is_read, metadata')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(100)
      if (error || !data || stopped) return
      const mapped: Whispr[] = (data as PollRow[]).map((w) => ({
        id: w.id,
        content: w.content,
        type: w.type as WhisprType,
        createdAt: w.created_at,
        isRead: w.is_read,
        metadata: w.metadata || {},
      }))
      onFetchRef.current(mapped)
    }

    const interval = setInterval(poll, POLL_INTERVAL_MS)
    const onVisible = () => {
      if (document.visibilityState === 'visible') poll()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      stopped = true
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [userId])
}

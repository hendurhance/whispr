import type { Whispr, WhisprStats, WhisprType } from '@/types/whispr'

export const INBOX_PAGE_SIZE = 50
export const WHISPR_COLUMNS = 'id, content, type, created_at, is_read, metadata'
export const EMPTY_STATS: WhisprStats = { total: 0, unread: 0, byType: {} }

export function toWhispr(row: WhisprRecord): Whispr {
  return {
    id: row.id,
    content: row.content,
    type: row.type as WhisprType,
    createdAt: row.created_at,
    isRead: !!row.is_read,
    metadata: row.metadata || {},
  }
}

export function escapeLikePattern(term: string): string {
  return term.replace(/[\\%_]/g, (c) => `\\${c}`)
}

export interface WhisprRecord {
  id: string
  content: string
  type: string
  created_at: string
  is_read: boolean | null
  metadata: Record<string, unknown> | null
}

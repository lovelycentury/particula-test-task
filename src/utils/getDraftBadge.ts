import type { ClauseDiff } from '@/types/diff'

/**
 * How the clause's "Draft" badge is shown:
 * `current` — a draft in both versions, `added` — became a draft,
 * `removed` — was a draft and is final now, `none` — no badge.
 */
export type DraftBadge = 'none' | 'current' | 'added' | 'removed'

export const getDraftBadge = (clause: ClauseDiff): DraftBadge => {
  const isDraft = clause.status === 'draft'
  // `previous.status` is set only when the status changed; `null` means it was final.
  const becameDraft = clause.previous?.status === null
  const wasDraft = clause.previous?.status === 'draft'

  if (isDraft && becameDraft) return 'added'

  if (isDraft) return 'current'

  if (wasDraft) return 'removed'

  return 'none'
}

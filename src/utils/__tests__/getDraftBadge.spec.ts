import { describe, expect, it } from 'vitest'
import type { ClauseDiff } from '@/types/diff'
import { getDraftBadge } from '../getDraftBadge'

const clause: ClauseDiff = {
  id: 'cl-1',
  type: 'clause',
  title: 'Clause',
  children: [],
  diffStatus: 'unchanged',
  hasChanges: false,
}

describe('getDraftBadge', () => {
  it('shows no badge for a clause that is final in both versions', () => {
    expect(getDraftBadge(clause)).toBe('none')
  })

  it('shows a plain badge for a clause that is a draft in both versions', () => {
    expect(getDraftBadge({ ...clause, status: 'draft' })).toBe('current')
  })

  it('marks the badge as added when the clause became a draft', () => {
    const result = getDraftBadge({
      ...clause,
      status: 'draft',
      diffStatus: 'changed',
      previous: { status: null },
    })

    expect(result).toBe('added')
  })

  it('marks the badge as removed when a draft became final', () => {
    const result = getDraftBadge({
      ...clause,
      diffStatus: 'changed',
      previous: { status: 'draft' },
    })

    expect(result).toBe('removed')
  })

  it('shows a plain badge on a new draft clause', () => {
    expect(getDraftBadge({ ...clause, status: 'draft', diffStatus: 'added' })).toBe('current')
  })
})

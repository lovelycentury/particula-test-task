import { describe, expect, it } from 'vitest'
import type { DocumentVersion } from '@/types/document'
import { formatDate, formatVersionLabel } from '../formatVersionLabel'

const createVersion = (version: number, updatedAt: string): DocumentVersion => ({
  id: 'doc',
  version,
  title: 'Doc',
  updatedAt,
  children: [],
})

describe('formatDate', () => {
  it('formats an ISO date as a short US date', () => {
    expect(formatDate('2026-01-15')).toBe('Jan 15, 2026')
  })

  it('keeps the calendar day regardless of the local time zone', () => {
    expect(formatDate('2026-09-01')).toBe('Sep 1, 2026')
  })
})

describe('formatVersionLabel', () => {
  it('joins the version number and its date', () => {
    expect(formatVersionLabel(createVersion(3, '2026-09-18'))).toBe('v3 · Sep 18, 2026')
  })
})

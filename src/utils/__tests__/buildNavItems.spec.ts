import { describe, expect, it } from 'vitest'
import type { ClauseNode, DocumentVersion, SectionNode } from '@/types/document'
import { buildNavItems } from '../buildNavItems'
import { diffDocument } from '../diffDocument'

const clause: ClauseNode = {
  id: 'cl-1',
  type: 'clause',
  title: 'Clause',
  children: [{ id: 'p-1', type: 'paragraph', text: 'Text' }],
}
const section: SectionNode = { id: 'sec', type: 'section', title: 'Section', children: [clause] }

const withSections = (...children: SectionNode[]): DocumentVersion => ({
  id: 'doc',
  version: 1,
  title: 'Doc',
  updatedAt: '2026-01-15',
  children,
})

const buildFor = (from: SectionNode[], to: SectionNode[]) =>
  buildNavItems(diffDocument(withSections(...from), withSections(...to)))

describe('buildNavItems', () => {
  it('builds one item without changes for an unchanged section', () => {
    expect(buildFor([section], [section])).toEqual([
      { id: 'sec', title: 'Section', changeCount: 0 },
    ])
  })

  it('counts changes inside the section', () => {
    const old: SectionNode = { ...section, children: [{ ...clause, title: 'Old' }] }

    expect(buildFor([old], [section])[0]?.changeCount).toBe(1)
  })

  it('adds one for a renamed section', () => {
    expect(buildFor([{ ...section, title: 'Old' }], [section])[0]?.changeCount).toBe(1)
  })

  it('keeps a removed section, counting it with everything inside', () => {
    const other: SectionNode = { id: 'sec-2', type: 'section', title: 'Other', children: [] }
    const items = buildFor([section, other], [other])

    expect(items.map((item) => item.id)).toEqual(['sec', 'sec-2'])
    // The section, its clause and the clause's paragraph.
    expect(items[0]?.changeCount).toBe(3)
  })
})

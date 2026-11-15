import { describe, expect, it } from 'vitest'
import type {
  ClauseNode,
  DocumentVersion,
  FieldNode,
  ParagraphNode,
  SectionNode,
} from '@/types/document'
import {
  addRemovedChildren,
  diffClause,
  diffField,
  diffParagraph,
  diffSection,
  indexNodes,
  isSameText,
} from '../diffDocument'

const version: DocumentVersion = {
  id: 'doc',
  version: 1,
  title: 'Doc',
  updatedAt: '2026-01-15',
  children: [
    {
      id: 'sec-a',
      type: 'section',
      title: 'A',
      children: [
        {
          id: 'sec-a-1',
          type: 'section',
          title: 'A.1',
          children: [
            {
              id: 'cl-1',
              type: 'clause',
              title: 'Clause',
              children: [
                { id: 'p-1', type: 'paragraph', text: 'Text' },
                { id: 'f-1', type: 'field', label: 'Label', value: 'Value' },
              ],
            },
          ],
        },
      ],
    },
  ],
}

describe('indexNodes', () => {
  const index = indexNodes(version)

  it('indexes every node at every depth', () => {
    expect([...index.keys()]).toEqual(['sec-a', 'sec-a-1', 'cl-1', 'p-1', 'f-1'])
  })

  it('leaves top-level sections without a parent', () => {
    expect(index.get('sec-a')?.parent).toBeUndefined()
  })

  it('links each nested node to the node that holds it', () => {
    expect(index.get('sec-a-1')?.parent?.id).toBe('sec-a')
    expect(index.get('cl-1')?.parent?.id).toBe('sec-a-1')
    expect(index.get('p-1')?.parent?.id).toBe('cl-1')
    expect(index.get('f-1')?.parent?.id).toBe('cl-1')
  })
})

describe('isSameText', () => {
  it('ignores whitespace-only differences', () => {
    expect(isSameText('  Core   hours\nstart ', 'Core hours start')).toBe(true)
  })

  it('detects real text changes', () => {
    expect(isSameText('25 days', '27 days')).toBe(false)
  })
})

describe('diffParagraph', () => {
  const paragraph: ParagraphNode = { id: 'p-1', type: 'paragraph', text: 'New text' }

  it('marks a paragraph without an old version as added', () => {
    expect(diffParagraph(paragraph)).toEqual({ ...paragraph, diffStatus: 'added' })
  })

  it('marks a paragraph with the same text as unchanged', () => {
    const old: ParagraphNode = { ...paragraph, text: ' New  text ' }

    expect(diffParagraph(paragraph, old)).toEqual({ ...paragraph, diffStatus: 'unchanged' })
  })

  it('keeps the old text of a changed paragraph', () => {
    const old: ParagraphNode = { ...paragraph, text: 'Old text' }

    expect(diffParagraph(paragraph, old)).toEqual({
      ...paragraph,
      diffStatus: 'changed',
      previous: { text: 'Old text' },
    })
  })

  it('sanitizes the text of both versions', () => {
    const current: ParagraphNode = { ...paragraph, text: 'New <b>text</b><img src="x">' }
    const old: ParagraphNode = { ...paragraph, text: 'Old<script>alert(1)</script>' }

    expect(diffParagraph(current, old)).toEqual({
      ...paragraph,
      text: 'New <b>text</b>',
      diffStatus: 'changed',
      previous: { text: 'Old' },
    })
  })

  it('ignores changes the reader cannot see', () => {
    const current: ParagraphNode = {
      ...paragraph,
      text: 'New text<img src="x" onerror="alert(1)">',
    }

    expect(diffParagraph(current, paragraph)).toEqual({ ...paragraph, diffStatus: 'unchanged' })
  })
})

describe('diffField', () => {
  const field: FieldNode = { id: 'f-1', type: 'field', label: 'Days per year', value: '27' }

  it('marks a field without an old version as added', () => {
    expect(diffField(field)).toEqual({ ...field, diffStatus: 'added' })
  })

  it('marks a field with the same label and value as unchanged', () => {
    expect(diffField(field, { ...field })).toEqual({ ...field, diffStatus: 'unchanged' })
  })

  it('keeps only the old value when just the value changed', () => {
    expect(diffField(field, { ...field, value: '25' })).toEqual({
      ...field,
      diffStatus: 'changed',
      previous: { value: '25' },
    })
  })

  it('keeps only the old label when just the label changed', () => {
    expect(diffField(field, { ...field, label: 'Days' })).toEqual({
      ...field,
      diffStatus: 'changed',
      previous: { label: 'Days' },
    })
  })

  it('keeps both when label and value changed', () => {
    expect(diffField(field, { ...field, label: 'Days', value: '25' })).toEqual({
      ...field,
      diffStatus: 'changed',
      previous: { label: 'Days', value: '25' },
    })
  })
})

describe('addRemovedChildren', () => {
  const toRemoved = (node: { id: string }) => ({ id: node.id, removed: true })
  const current = (...ids: string[]) => ids.map((id) => ({ id, removed: false }))
  const old = (...ids: string[]) => ids.map((id) => ({ id }))
  const summarize = (nodes: { id: string; removed: boolean }[]) =>
    nodes.map((node) => (node.removed ? `-${node.id}` : node.id))

  it('puts a removed child right after its old previous sibling', () => {
    const result = addRemovedChildren(current('A', 'C', 'D'), old('A', 'B', 'C'), toRemoved)

    expect(summarize(result)).toEqual(['A', '-B', 'C', 'D'])
  })

  it('puts a removed first child at the start', () => {
    const result = addRemovedChildren(current('B'), old('A', 'B'), toRemoved)

    expect(summarize(result)).toEqual(['-A', 'B'])
  })

  it('keeps consecutive removed children in their old order', () => {
    const result = addRemovedChildren(current('A', 'D'), old('A', 'B', 'C', 'D'), toRemoved)

    expect(summarize(result)).toEqual(['A', '-B', '-C', 'D'])
  })

  it('returns only removed children when nothing is left', () => {
    const result = addRemovedChildren([], old('A', 'B'), toRemoved)

    expect(summarize(result)).toEqual(['-A', '-B'])
  })

  it('leaves current children as they are when nothing was removed', () => {
    const result = addRemovedChildren(current('B', 'A'), old('A', 'B'), toRemoved)

    expect(summarize(result)).toEqual(['B', 'A'])
  })
})

describe('diffClause', () => {
  const paragraph: ParagraphNode = { id: 'p-1', type: 'paragraph', text: 'Text' }
  const field: FieldNode = { id: 'f-1', type: 'field', label: 'Days', value: '27' }
  const clause: ClauseNode = {
    id: 'cl-1',
    type: 'clause',
    title: 'Annual leave',
    children: [field, paragraph],
  }

  /** Index of an old version holding just the given clause. */
  const indexClause = (old: ClauseNode) =>
    indexNodes({
      ...version,
      children: [{ id: 'sec-a', type: 'section', title: 'A', children: [old] }],
    })

  it('marks a clause missing from the old version as added, with all its children', () => {
    const result = diffClause(clause, indexClause({ ...clause, id: 'cl-other', children: [] }))

    expect(result.diffStatus).toBe('added')
    expect(result.previous).toBeUndefined()
    expect(result.hasChanges).toBe(true)
    expect(result.children.map((child) => child.diffStatus)).toEqual(['added', 'added'])
  })

  it('marks an identical clause as unchanged without changes inside', () => {
    const result = diffClause(clause, indexClause(clause))

    expect(result.diffStatus).toBe('unchanged')
    expect(result.hasChanges).toBe(false)
    expect(result.children.map((child) => child.diffStatus)).toEqual(['unchanged', 'unchanged'])
  })

  it('ignores whitespace-only title changes', () => {
    const result = diffClause(clause, indexClause({ ...clause, title: ' Annual  leave ' }))

    expect(result.diffStatus).toBe('unchanged')
  })

  it('keeps the old title of a renamed clause', () => {
    const result = diffClause(clause, indexClause({ ...clause, title: 'Holidays' }))

    expect(result.diffStatus).toBe('changed')
    expect(result.previous).toEqual({ title: 'Holidays' })
  })

  it('records a clause that became a draft as previously final', () => {
    const result = diffClause({ ...clause, status: 'draft' }, indexClause(clause))

    expect(result.diffStatus).toBe('changed')
    expect(result.previous).toEqual({ status: null })
  })

  it('records a draft that became final', () => {
    const result = diffClause(clause, indexClause({ ...clause, status: 'draft' }))

    expect(result.diffStatus).toBe('changed')
    expect(result.previous).toEqual({ status: 'draft' })
  })

  it('keeps a still-draft clause unchanged', () => {
    const draft: ClauseNode = { ...clause, status: 'draft' }

    expect(diffClause(draft, indexClause(draft)).diffStatus).toBe('unchanged')
  })

  it('flags changes inside the clause without changing its own status', () => {
    const old: ClauseNode = { ...clause, children: [{ ...field, value: '25' }, paragraph] }
    const result = diffClause(clause, indexClause(old))

    expect(result.diffStatus).toBe('unchanged')
    expect(result.hasChanges).toBe(true)
    expect(result.children[0]).toEqual({
      ...field,
      diffStatus: 'changed',
      previous: { value: '25' },
    })
  })

  it('puts a removed child back at its old place', () => {
    const removed: ParagraphNode = { id: 'p-old', type: 'paragraph', text: 'Old' }
    const old: ClauseNode = { ...clause, children: [field, removed, paragraph] }
    const result = diffClause(clause, indexClause(old))

    expect(result.diffStatus).toBe('unchanged')
    expect(result.hasChanges).toBe(true)
    expect(result.children.map((child) => [child.id, child.diffStatus])).toEqual([
      ['f-1', 'unchanged'],
      ['p-old', 'removed'],
      ['p-1', 'unchanged'],
    ])
  })

  it('sanitizes the text of a removed paragraph', () => {
    const removed: ParagraphNode = {
      id: 'p-old',
      type: 'paragraph',
      text: '<img src="x" onerror="alert(1)">Old',
    }
    const result = diffClause(clause, indexClause({ ...clause, children: [removed] }))

    expect(result.children[0]).toEqual({ ...removed, text: 'Old', diffStatus: 'removed' })
  })
})

describe('diffSection', () => {
  const paragraph: ParagraphNode = { id: 'p-1', type: 'paragraph', text: 'Text' }
  const clause: ClauseNode = { id: 'cl-1', type: 'clause', title: 'Leave', children: [paragraph] }
  const nested: SectionNode = { id: 'sec-1', type: 'section', title: 'Nested', children: [clause] }
  const section: SectionNode = { id: 'sec', type: 'section', title: 'Benefits', children: [nested] }

  const indexSection = (old: SectionNode) => indexNodes({ ...version, children: [old] })

  it('marks a section missing from the old version as added, with everything inside', () => {
    const result = diffSection(section, indexSection({ ...section, id: 'sec-other', children: [] }))

    expect(result.diffStatus).toBe('added')
    expect(result.hasChanges).toBe(true)
    expect(result.children[0]?.diffStatus).toBe('added')
  })

  it('marks an identical section as unchanged without changes inside', () => {
    const result = diffSection(section, indexSection(section))

    expect(result.diffStatus).toBe('unchanged')
    expect(result.previous).toBeUndefined()
    expect(result.hasChanges).toBe(false)
  })

  it('ignores whitespace-only title changes', () => {
    const result = diffSection(section, indexSection({ ...section, title: ' Benefits ' }))

    expect(result.diffStatus).toBe('unchanged')
  })

  it('keeps the old title of a renamed section', () => {
    const result = diffSection(section, indexSection({ ...section, title: 'Perks' }))

    expect(result.diffStatus).toBe('changed')
    expect(result.previous).toEqual({ title: 'Perks' })
  })

  it('flags a change deep inside without changing the section status', () => {
    const oldClause: ClauseNode = { ...clause, children: [{ ...paragraph, text: 'Old' }] }
    const old: SectionNode = { ...section, children: [{ ...nested, children: [oldClause] }] }
    const result = diffSection(section, indexSection(old))

    expect(result.diffStatus).toBe('unchanged')
    expect(result.hasChanges).toBe(true)
    expect(result.children[0]?.diffStatus).toBe('unchanged')
    expect(result.children[0]?.hasChanges).toBe(true)
  })

  it('puts a removed clause back with all its children removed', () => {
    const removed: ClauseNode = {
      id: 'cl-old',
      type: 'clause',
      title: 'Old',
      children: [{ id: 'p-old', type: 'paragraph', text: 'Old' }],
    }
    const result = diffSection(section, indexSection({ ...section, children: [removed, nested] }))

    expect(result.hasChanges).toBe(true)
    expect(result.children[0]).toEqual({
      ...removed,
      diffStatus: 'removed',
      hasChanges: true,
      children: [{ id: 'p-old', type: 'paragraph', text: 'Old', diffStatus: 'removed' }],
    })
    expect(result.children[1]?.id).toBe('sec-1')
  })

  it('puts a removed nested section back with everything inside removed', () => {
    const removed: SectionNode = {
      id: 'sec-old',
      type: 'section',
      title: 'Old',
      children: [{ ...clause, id: 'cl-old', children: [] }],
    }
    const result = diffSection(section, indexSection({ ...section, children: [nested, removed] }))
    const removedDiff = result.children[1]

    expect(removedDiff?.diffStatus).toBe('removed')
    expect(removedDiff?.children.map((child) => [child.id, child.diffStatus])).toEqual([
      ['cl-old', 'removed'],
    ])
  })

  describe('changeCount', () => {
    it('is zero when nothing changed', () => {
      expect(diffSection(section, indexSection(section)).changeCount).toBe(0)
    })

    it('counts a change deep inside in every section above it', () => {
      const oldClause: ClauseNode = { ...clause, children: [{ ...paragraph, text: 'Old' }] }
      const old: SectionNode = { ...section, children: [{ ...nested, children: [oldClause] }] }
      const result = diffSection(section, indexSection(old))

      expect(result.changeCount).toBe(1)
      expect(result.children[0]?.changeCount).toBe(1)
    })

    it('counts a renamed nested section in its parent only', () => {
      const old: SectionNode = { ...section, children: [{ ...nested, title: 'Old' }] }
      const result = diffSection(section, indexSection(old))

      expect(result.changeCount).toBe(1)
      expect(result.children[0]?.changeCount).toBe(0)
    })

    it('counts an unchanged draft clause once', () => {
      const draft: SectionNode = { ...section, children: [{ ...clause, status: 'draft' }] }

      expect(diffSection(draft, indexSection(draft)).changeCount).toBe(1)
    })

    it('counts a renamed draft clause once', () => {
      const draft: SectionNode = { ...section, children: [{ ...clause, status: 'draft' }] }
      const old: SectionNode = {
        ...section,
        children: [{ ...clause, status: 'draft', title: 'Old' }],
      }

      expect(diffSection(draft, indexSection(old)).changeCount).toBe(1)
    })

    it('counts an added clause together with everything inside', () => {
      const added: ClauseNode = {
        id: 'cl-new',
        type: 'clause',
        title: 'New',
        children: [
          { id: 'p-a', type: 'paragraph', text: 'A' },
          { id: 'p-b', type: 'paragraph', text: 'B' },
          { id: 'f-c', type: 'field', label: 'C', value: 'c' },
        ],
      }
      const current: SectionNode = { ...section, children: [nested, added] }

      expect(diffSection(current, indexSection(section)).changeCount).toBe(4)
    })

    it('counts a removed section together with everything inside', () => {
      const removed: SectionNode = {
        id: 'sec-old',
        type: 'section',
        title: 'Old',
        children: [
          {
            id: 'cl-a',
            type: 'clause',
            title: 'A',
            children: [{ id: 'p-a', type: 'paragraph', text: 'A' }],
          },
          {
            id: 'cl-b',
            type: 'clause',
            title: 'B',
            children: [{ id: 'p-b', type: 'paragraph', text: 'B' }],
          },
        ],
      }
      const result = diffSection(section, indexSection({ ...section, children: [nested, removed] }))

      expect(result.children[1]?.changeCount).toBe(4)
      expect(result.changeCount).toBe(5)
    })
  })
})

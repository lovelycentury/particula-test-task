import { describe, expect, it } from 'vitest'
import type { DocumentVersion } from '@/types/document'
import { indexNodes } from '../diffDocument'

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

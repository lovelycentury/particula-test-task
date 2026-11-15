import { describe, expect, it } from 'vitest'
import { headingTag } from '../headingTag'

describe('headingTag', () => {
  it('turns a level into a heading tag', () => {
    expect(headingTag(2)).toBe('h2')
  })

  it('caps levels deeper than h6', () => {
    expect(headingTag(8)).toBe('h6')
  })
})

import { describe, expect, it } from 'vitest'
import { sanitizeHtml } from '../sanitizeHtml'

describe('sanitizeHtml', () => {
  it('keeps plain text as is', () => {
    expect(sanitizeHtml('Submit receipts within 30 days.')).toBe('Submit receipts within 30 days.')
  })

  it('keeps inline formatting', () => {
    expect(sanitizeHtml('<b>30</b> <strong>days</strong> <i>of</i> <em>the</em>')).toBe(
      '<b>30</b> <strong>days</strong> <i>of</i> <em>the</em>',
    )
  })

  it('keeps links with their href', () => {
    expect(sanitizeHtml('<a href="https://example.com">portal</a>')).toBe(
      '<a href="https://example.com">portal</a>',
    )
  })

  it('drops images together with their event handlers', () => {
    expect(sanitizeHtml('Text.<img src="x" onerror="alert(1)">')).toBe('Text.')
  })

  it('drops scripts', () => {
    expect(sanitizeHtml('Text.<script>alert(1)</script>')).toBe('Text.')
  })

  it('drops attributes other than href', () => {
    expect(sanitizeHtml('<a href="https://example.com" onclick="alert(1)">portal</a>')).toBe(
      '<a href="https://example.com">portal</a>',
    )
  })

  it('drops javascript: links', () => {
    expect(sanitizeHtml('<a href="javascript:alert(1)">portal</a>')).toBe('<a>portal</a>')
  })

  it('adds noopener noreferrer to links that open in a new tab', () => {
    expect(sanitizeHtml('<a href="https://example.com" target="_blank">portal</a>')).toBe(
      '<a href="https://example.com" target="_blank" rel="noopener noreferrer">portal</a>',
    )
  })

  it('replaces a rel coming from the document', () => {
    expect(
      sanitizeHtml('<a href="https://example.com" target="_blank" rel="opener">portal</a>'),
    ).toBe('<a href="https://example.com" target="_blank" rel="noopener noreferrer">portal</a>')
  })

  it('drops targets other than _blank', () => {
    expect(sanitizeHtml('<a href="https://example.com" target="_top">portal</a>')).toBe(
      '<a href="https://example.com">portal</a>',
    )
  })

  it('leaves links without a target alone', () => {
    expect(sanitizeHtml('<a href="https://example.com" rel="opener">portal</a>')).toBe(
      '<a href="https://example.com">portal</a>',
    )
  })

  it('unwraps tags that are not allowed but keeps their text', () => {
    expect(sanitizeHtml('<span class="x">Text</span>')).toBe('Text')
  })
})

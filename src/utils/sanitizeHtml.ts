import DOMPurify from 'dompurify'

/** Inline formatting and links only; everything else, `<img>` included, is dropped. */
const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'a']
const ALLOWED_ATTR = ['href', 'target']

/** Own instance, so the hook below doesn't leak into other DOMPurify users. */
const purify = DOMPurify()

const isLink = (node: Element): node is HTMLAnchorElement => node.tagName === 'A'

/**
 * A link may only open in a new tab, and then it must not get access to this page
 * (`noopener`) or leak its URL (`noreferrer`).
 */
const secureLinkTarget = (node: Element) => {
  if (!isLink(node) || !node.hasAttribute('target')) return

  if (node.getAttribute('target') !== '_blank') {
    node.removeAttribute('target')
    return
  }

  node.setAttribute('rel', 'noopener noreferrer')
}

purify.addHook('afterSanitizeAttributes', secureLinkTarget)

/** Makes document HTML safe to render with `v-html`. */
export const sanitizeHtml = (html: string) => purify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR })

export interface DocumentNavItem {
  /** Id of the section the item links to. */
  id: string
  title: string
  /** Number shown on the right; hidden when absent or zero. */
  changeCount?: number
  /** Shows a dot after the title to draw the reader's attention. */
  marked?: boolean
}

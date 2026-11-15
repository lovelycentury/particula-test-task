export type DocumentNavItem = {
  /** Id of the section the item links to. */
  id: string
  title: string
  /** Number shown on the right; hidden when absent or zero. */
  changeCount?: number
}

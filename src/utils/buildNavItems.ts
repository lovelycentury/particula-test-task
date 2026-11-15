import type { DocumentNavItem } from '@/components/DocumentNav'
import type { DocumentDiff, SectionChildDiff, SectionDiff } from '@/types/diff'

/** A draft still in the document needs the reader's attention; a removed one doesn't. */
const isOpenDraft = (child: SectionChildDiff) =>
  child.type === 'clause' && child.status === 'draft' && child.diffStatus !== 'removed'

/** Sections nest, so this walks down the section tree; its depth is small and bounded. */
const hasOpenDraft = (section: SectionDiff): boolean => {
  for (const child of section.children) {
    if (isOpenDraft(child)) return true

    if (child.type === 'section' && hasOpenDraft(child)) return true
  }

  return false
}

/** Changes inside the section plus one when the section itself was added, removed or renamed. */
const countNavChanges = (section: SectionDiff) => {
  if (section.diffStatus === 'unchanged') return section.changeCount

  return section.changeCount + 1
}

const toNavItem = (section: SectionDiff): DocumentNavItem => ({
  id: section.id,
  title: section.title,
  changeCount: countNavChanges(section),
  marked: hasOpenDraft(section),
})

/** Sidebar items for the top-level sections of a diff, removed ones included. */
export const buildNavItems = (diff: DocumentDiff) => diff.sections.map(toNavItem)

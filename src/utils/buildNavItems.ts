import type { DocumentNavItem } from '@/components/DocumentNav'
import type { DocumentDiff, SectionDiff } from '@/types/diff'

/** Changes inside the section plus one when the section itself was added, removed or renamed. */
const countNavChanges = (section: SectionDiff) => {
  if (section.diffStatus === 'unchanged') return section.changeCount

  return section.changeCount + 1
}

const toNavItem = (section: SectionDiff): DocumentNavItem => ({
  id: section.id,
  title: section.title,
  changeCount: countNavChanges(section),
})

/** Sidebar items for the top-level sections of a diff, removed ones included. */
export const buildNavItems = (diff: DocumentDiff) => diff.sections.map(toNavItem)

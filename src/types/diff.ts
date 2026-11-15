import type {
  ClauseNode,
  ClauseStatus,
  DocumentVersion,
  FieldNode,
  ParagraphNode,
  SectionNode,
} from './document'

/**
 * How a node differs between the two compared versions.
 * Removed nodes stay in the tree at their old position, so one column can render both versions.
 */
export type DiffStatus = 'added' | 'removed' | 'changed' | 'unchanged'

/** The other parent of a node that moved to a different section between versions. */
export type MoveTarget = {
  parentId: string
  parentTitle: string
}

/** Diff data shared by every node. `Previous` lists the fields whose old value is kept. */
type DiffMeta<Previous> = {
  diffStatus: DiffStatus
  /** Old values of the fields that changed; only set on `changed` nodes. */
  previous?: Previous
  /** Set on the node at its new place. */
  movedFrom?: MoveTarget
  /** Set on the `removed` copy left at the old place. */
  movedTo?: MoveTarget
}

export type ParagraphDiff = ParagraphNode & DiffMeta<{ text?: string }>

export type FieldDiff = FieldNode & DiffMeta<{ label?: string; value?: string }>

export type ClauseChildDiff = ParagraphDiff | FieldDiff

/** `previous.status: null` means the clause used to be final. */
export type ClauseDiff = Omit<ClauseNode, 'children'> &
  DiffMeta<{ title?: string; status?: ClauseStatus | null }> & {
    children: ClauseChildDiff[]
    /** True when the clause itself or any of its children changed. */
    hasChanges: boolean
  }

export type SectionChildDiff = SectionDiff | ClauseDiff

export type SectionDiff = Omit<SectionNode, 'children'> &
  DiffMeta<{ title?: string }> & {
    children: SectionChildDiff[]
    /** True when the section itself or anything inside it changed. */
    hasChanges: boolean
    /** Changes inside the section, for the sidebar; a draft clause counts as one change. */
    changeCount: number
  }

export type DiffNode = SectionDiff | ClauseDiff | ParagraphDiff | FieldDiff

/** Result of comparing two versions of one document. */
export type DocumentDiff = {
  from: DocumentVersion
  to: DocumentVersion
  /** Sections of `to`, with removed ones put back where they were in `from`. */
  sections: SectionDiff[]
  hasChanges: boolean
}

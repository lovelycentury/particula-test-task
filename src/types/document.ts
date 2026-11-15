/** Leaf: free-form text block. */
export type ParagraphNode = {
  id: string
  type: 'paragraph'
  text: string
}

/** Leaf: labeled key/value pair. */
export type FieldNode = {
  id: string
  type: 'field'
  label: string
  value: string
}

export type ClauseStatus = 'draft'

/** Groups leaf content (paragraphs and fields). */
export type ClauseNode = {
  id: string
  type: 'clause'
  title: string
  /** Absent means the clause is final. */
  status?: ClauseStatus
  children: ClauseChild[]
}

/** Top-level or nested grouping of clauses and sub-sections. */
export type SectionNode = {
  id: string
  type: 'section'
  title: string
  children: SectionChild[]
}

export type ClauseChild = ParagraphNode | FieldNode
export type SectionChild = SectionNode | ClauseNode

export type DocumentNode = SectionNode | ClauseNode | ParagraphNode | FieldNode
export type DocumentNodeType = DocumentNode['type']

/** One snapshot of a document, as stored in `mocks/v*.json`. */
export type DocumentVersion = {
  id: string
  version: number
  title: string
  /** ISO date, `YYYY-MM-DD`. */
  updatedAt: string
  children: SectionNode[]
}

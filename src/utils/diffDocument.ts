import type {
  ClauseChildDiff,
  ClauseDiff,
  DiffStatus,
  FieldDiff,
  ParagraphDiff,
} from '@/types/diff'
import type {
  ClauseChild,
  ClauseNode,
  DocumentNode,
  DocumentVersion,
  FieldNode,
  ParagraphNode,
  SectionNode,
} from '@/types/document'
import { sanitizeHtml } from './sanitizeHtml'

/** A node that holds other nodes. */
type ParentNode = SectionNode | ClauseNode

/** A node together with the node that holds it; top-level sections have no parent. */
export type IndexedNode = {
  node: DocumentNode
  parent?: ParentNode
}

/** Every node of a version by id. Ids are unique within a version. */
export type NodeIndex = Map<string, IndexedNode>

const addToIndex = (index: NodeIndex, node: DocumentNode, parent?: ParentNode) => {
  index.set(node.id, { node, parent })

  if (node.type === 'paragraph' || node.type === 'field') return

  for (const child of node.children) addToIndex(index, child, node)
}

export const indexNodes = (version: DocumentVersion): NodeIndex => {
  const index: NodeIndex = new Map()

  for (const section of version.children) addToIndex(index, section)

  return index
}

/** Collapses runs of whitespace and trims, so whitespace-only edits don't count as changes. */
const normalizeWhitespace = (text: string) => text.replace(/\s+/g, ' ').trim()

export const isSameText = (current: string, old: string) =>
  normalizeWhitespace(current) === normalizeWhitespace(old)

/**
 * Paragraph text is HTML, so both versions are sanitized first: changes the reader
 * can't see (e.g. an added `onerror`) don't count, and the result is safe to render.
 */
export const diffParagraph = (node: ParagraphNode, old?: ParagraphNode): ParagraphDiff => {
  const text = sanitizeHtml(node.text)

  if (!old) return { ...node, text, diffStatus: 'added' }

  const oldText = sanitizeHtml(old.text)

  if (isSameText(text, oldText)) return { ...node, text, diffStatus: 'unchanged' }

  return { ...node, text, diffStatus: 'changed', previous: { text: oldText } }
}

type FieldPrevious = NonNullable<FieldDiff['previous']>

/** Old values of the field parts that changed; empty when nothing did. */
const getFieldPrevious = (node: FieldNode, old: FieldNode): FieldPrevious => {
  const previous: FieldPrevious = {}

  if (!isSameText(node.label, old.label)) previous.label = old.label
  if (!isSameText(node.value, old.value)) previous.value = old.value

  return previous
}

const isEmpty = (object: object) => Object.keys(object).length === 0

export const diffField = (node: FieldNode, old?: FieldNode): FieldDiff => {
  if (!old) return { ...node, diffStatus: 'added' }

  const previous = getFieldPrevious(node, old)

  if (isEmpty(previous)) return { ...node, diffStatus: 'unchanged' }

  return { ...node, diffStatus: 'changed', previous }
}

const isSameType = <T extends DocumentNode>(node: T, other: DocumentNode): other is T =>
  other.type === node.type

/**
 * The node with the same id in the old version. Ids keep their type across versions;
 * the type check only narrows `DocumentNode` to `T` for TypeScript.
 */
const findOld = <T extends DocumentNode>(oldIndex: NodeIndex, node: T): T | undefined => {
  const old = oldIndex.get(node.id)?.node

  if (!old || !isSameType(node, old)) return undefined

  return old
}

const isChanged = (node: { diffStatus: DiffStatus }) => node.diffStatus !== 'unchanged'

const diffClauseChild = (child: ClauseChild, oldIndex: NodeIndex): ClauseChildDiff => {
  if (child.type === 'paragraph') return diffParagraph(child, findOld(oldIndex, child))

  return diffField(child, findOld(oldIndex, child))
}

type ClausePrevious = NonNullable<ClauseDiff['previous']>

/** Old title and draft status, when they changed; `status: null` means the clause was final. */
const getClausePrevious = (node: ClauseNode, old: ClauseNode): ClausePrevious => {
  const previous: ClausePrevious = {}

  if (!isSameText(node.title, old.title)) previous.title = old.title
  if (node.status !== old.status) previous.status = old.status ?? null

  return previous
}

const getClauseStatus = (previous: ClausePrevious, old?: ClauseNode): DiffStatus => {
  if (!old) return 'added'

  if (isEmpty(previous)) return 'unchanged'

  return 'changed'
}

/**
 * `diffStatus` covers the clause's own title and status; edits inside it only set `hasChanges`.
 */
export const diffClause = (node: ClauseNode, oldIndex: NodeIndex): ClauseDiff => {
  const old = findOld(oldIndex, node)
  const previous = old ? getClausePrevious(node, old) : {}
  const diffStatus = getClauseStatus(previous, old)
  const children = node.children.map((child) => diffClauseChild(child, oldIndex))
  const hasChanges = diffStatus !== 'unchanged' || children.some(isChanged)

  if (diffStatus !== 'changed') return { ...node, diffStatus, children, hasChanges }

  return { ...node, diffStatus, previous, children, hasChanges }
}

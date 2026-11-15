import type { ClauseNode, DocumentNode, DocumentVersion, SectionNode } from '@/types/document'

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

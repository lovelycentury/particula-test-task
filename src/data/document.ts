import type { DocumentVersion } from '@/types/document'
import v1 from '../../mocks/v1.json'
import v2 from '../../mocks/v2.json'
import v3 from '../../mocks/v3.json'

/** JSON imports widen `type` literals to `string`; the mocks match `DocumentVersion`. */
const asDocumentVersion = (json: unknown) => json as DocumentVersion

/** All versions, oldest first. */
export const documentVersions: DocumentVersion[] = [v1, v2, v3].map(asDocumentVersion)

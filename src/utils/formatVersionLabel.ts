import type { DocumentVersion } from '@/types/document'

/** `YYYY-MM-DD` dates are parsed as UTC midnight, so format in UTC to keep the same day. */
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

/** `2026-01-15` → `Jan 15, 2026`. */
export const formatDate = (isoDate: string) => dateFormatter.format(new Date(isoDate))

/** `v1 · Jan 15, 2026`. */
export const formatVersionLabel = ({ version, updatedAt }: DocumentVersion) =>
  `v${version} · ${formatDate(updatedAt)}`

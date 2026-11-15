/** HTML has headings `h1`–`h6`; deeper levels reuse `h6`. */
const MAX_HEADING_LEVEL = 6

/** `2` → `h2`. Nested sections can go deeper than HTML allows, so the level is capped. */
export const headingTag = (level: number) => `h${Math.min(level, MAX_HEADING_LEVEL)}`

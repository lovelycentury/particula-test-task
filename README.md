## Setup

The project uses [pnpm](https://pnpm.io/).

```sh
pnpm install
pnpm dev          # start dev server
pnpm build        # type-check and build for production
pnpm test:unit    # run unit tests
pnpm lint         # lint with oxlint and ESLint
```

## Dependencies

Besides the Vite + Vue scaffold, the project adds:

| Package                       | Why                                                                        |
| ----------------------------- | -------------------------------------------------------------------------- |
| `@okkly/design-system`        | My own library: design tokens (`--okkly-*` CSS variables) and base styles. |
| `@okkly/vue`                  | My own library: ready-made Vue components built on those tokens.           |
| `@fontsource/inter`           | Self-hosted sans font of the design system.                                |
| `@fontsource/jetbrains-mono`  | Self-hosted mono font of the design system.                                |
| `dompurify`                   | Sanitizes HTML from documents to prevent XSS.                              |
| `vitest` (dev)                | Unit tests for `src/utils`.                                                |
| `jsdom`, `@types/jsdom` (dev) | Browser-like DOM for tests; DOMPurify needs it.                            |
| `sass-embedded` (dev)         | Compiles the design system's `.scss` styles.                               |

## Assumptions

- **Any two versions can be compared.** The default is oldest vs. latest. Readers usually
  compare the version they last read with the next one, so picking the older version is
  kept easy.
- **Content is matched by `id`.** Ids are unique within a version and stable across
  versions. If an id changes, it counts as a removal plus an addition; similar content is
  not detected.
- **Every content change is shown, even small ones.** Whitespace-only changes are ignored,
  since readers don't care about them.
- **Values are compared as plain text.** Field values like dates and numbers are strings
  and are not parsed.
- **Draft clauses are shown to readers.** A draft is part of the document, so it is
  rendered and clearly marked as a draft, so it can't be mistaken for a final clause.
  In the change summary a draft clause counts as one change, however much content it
  holds.

## Done

- **Navigate the document structure.** The sidebar lists all top-level sections.
  Click a section to jump to it. Each section shows how many changes it has.
- **Show what changed between two versions.** Pick any two versions at the top.
  - Added text is green and underlined, removed text is red and crossed out.
  - Changed text shows the old value crossed out next to the new one.
  - A colored line on the left marks every changed line.
  - Removed parts stay in their old place, so you can read both versions in one view.
  - Draft clauses have a "Draft" badge and a light yellow background.
- **Works on a laptop screen.** The layout uses a fixed sidebar and a centered text
  column that fits common laptop widths.

## Not done

- **Moves are not marked.** If a part moves to another section, it is shown as removed
  in the old place. The new place does not say where it came from.
  Fix: fill the `movedFrom` / `movedTo` fields in `src/types/diff.ts` (they exist but
  are never set).
- **Paragraphs are not compared word by word.** If a paragraph changes, the whole old
  text is crossed out and the whole new text is shown below. Small changes in long
  paragraphs are hard to see.
- **No notes about changes.** Changes are only shown as crossed out (old) and
  underlined (new) text. There are no notes like "renamed from …" or "was a draft in v1".
- **Removed sections look normal in the sidebar.** In the document they are red and
  crossed out, but in the sidebar they look like other sections.
  Fix: cross them out in red in the sidebar too.
- **The sidebar does not show where you are.** When you scroll, the current section
  is not highlighted in the sidebar.
  Fix: watch which section is on the screen and highlight it.
- **Repeated fields are not shown as a table.** Some sections have many clauses with
  the same fields (e.g. Approved Tools: each tool has Vendor and Status). They take a
  lot of space as a list.
  Fix: if 5 or more clauses in a row have the same field labels, show them as a table.
- **Dates and numbers are compared as text.** "1,000 EUR" and "1000 EUR" count as a
  change, even if the value is the same. The same is true for dates in different formats.
  Fix: once paragraphs are compared word by word, each word could also be checked as a
  date or a number. Then only real value changes would be shown.

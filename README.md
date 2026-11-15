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

## Not done

- **Moves are not marked.** When a node moves to another section or clause, the diff shows
  it as removed at its old place and compares it by `id` at its new place, without saying
  where it came from or went to. The `movedFrom` / `movedTo` fields in `src/types/diff.ts`
  are reserved for this and are never set yet.

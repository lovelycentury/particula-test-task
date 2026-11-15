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

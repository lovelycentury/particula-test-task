# Design system

This project uses the Okkly design system (`@okkly/design-system` + `@okkly/vue`).

- Use `@okkly/vue` components before writing custom UI.
- Style with `--okkly-*` tokens (space, radius, colors); no hard-coded values.
- Use `<Box>` for layout (spacing, flex, surfaces); use scoped BEM CSS with tokens for states, transitions and anything Box can't express.
- Text via `<Typography>`, icons via `<Icon>`.
- Component docs: `node_modules/@okkly/vue/README.md`; props in `node_modules/@okkly/vue/dist/components/*/*.types.d.ts`.
- Color palette: `node_modules/@okkly/design-system/src/styles/tokens/colors.css`.

# Components

- One folder per component: `src/components/<Name>/<Name>.vue` plus `src/components/<Name>/index.ts`.
- `index.ts` re-exports the component by name: `export { default as <Name> } from './<Name>.vue'`.
- Import components through their folder, never the `.vue` file: `import { DocumentList } from '@/components/DocumentList'`.
- Child components used only by one parent live in the parent's folder, are imported with a relative path (`./DocumentListItem.vue`) and are not re-exported.

# Code style

- Use `type` aliases, not `interface`; compose with `&` instead of `extends`.
- Use arrow functions only (`const fn = () => {}`); no `function` declarations or expressions.
- Split logic into small single-purpose functions with descriptive names; declare helpers before the code that uses them.
- Use early returns (`if (...) return ...`) instead of ternaries in script logic; ternaries are fine in templates. Separate each early return from the next statement with a blank line.
- Avoid non-null assertions (`!`); use `??`, optional chaining or one small helper that documents why the value is safe.
- Prefer readability over clever style: plain loops inside small functions are fine; no recursion over unbounded input (e.g. text length).
- Cover logic in `src/utils` with Vitest specs in `src/utils/__tests__/` (`npm run test:unit`).

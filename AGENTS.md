# Agent Guidelines for Musikverein-Münster

## Build & Development Commands
- **Dev**: `npm run dev` (runs dev server on port 4200 with i18n)
- **Build**: `npm run build`
- **Type Check**: `npm run check` (or `npm run check:watch`)
- **Lint**: `npm run lint`
- **Format**: `npm run format`
- **Tests**: No test suite configured

## Code Style
- **Formatting**: Prettier with tabs, single quotes, no trailing commas, 100 char width
- **Imports**: Auto-organized via `prettier-plugin-organize-imports`
- **TypeScript**: Strict mode enabled (`strict: true` in tsconfig)
- **Path Aliases**: Use `$lib`, `$components`, `$utils`, `$states`, `$routes` (see svelte.config.js)
- **Naming**: camelCase for functions/variables, PascalCase for components/types
- **Svelte 5**: Use runes syntax (`.svelte.ts` for state files)
- **Styling**: TailwindCSS v4 with `@tailwindcss/typography` for markdown

## Error Handling
- Use try-catch blocks for async operations (see hooks.server.ts:18-22)
- Silent failures with `catch (_)` only when appropriate (e.g., auth refresh)

## Key Tech Stack
- **Framework**: SvelteKit 2 with Svelte 5
- **Backend**: PocketBase (via `event.locals.pb`)
- **i18n**: typesafe-i18n (de/en locales)

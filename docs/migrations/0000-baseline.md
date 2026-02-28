# Baseline (Pre-Migration)

Date: 2026-03-01

## Repo State

- Branch at capture time: `codex/bun-next-modernize`
- Baseline commit: `1504463cfe2dbae78cf59b77bcb7ba4bd605b612`

## Tooling Versions (Local)

- Node: `v25.6.1` (target minimum for the migration: Node `>=22`)
- Bun: `1.3.9` (plan target: `1.3.10`)
- Yarn: `4.12.0` (currently in use via Yarn PnP artifacts)

## Current App Stack

- Framework/build: Create React App (`react-scripts`)
- Styling: Tailwind CSS v3 + PostCSS (manual `build:css` script)
- Tests: CRA/Jest default + Testing Library

## Current `package.json` Summary

Scripts:

- `start`: `react-scripts start`
- `build`: `react-scripts build`
- `test`: `react-scripts test`
- `build:css`: `postcss src/tailwind.css -o src/index.css`
- `format` / `format:check`: Prettier (glob appears incorrect: `**/*.{js{x},ts{x},...}`)

Notable deps:

- `react@18.2.0`, `react-dom@18.2.0`
- `react-scripts@5.0.1`
- `react-helmet@6.1.0`
- `tailwindcss@3.4.1`
- `prettier@2.5.1`

## Yarn/PnP Artifacts Present

- `yarn.lock`
- `.pnp.cjs`
- `.pnp.loader.mjs`
- `.yarn/`

## Known Issues (Pre-Migration)

- Stale test: `src/App.test.js` expects "learn react" text that no longer exists.
- `build:css` references `src/tailwind.css`, which is not present in the repo.
- SEO/social metadata is managed in `react-helmet` with incorrect OG/Twitter image paths.

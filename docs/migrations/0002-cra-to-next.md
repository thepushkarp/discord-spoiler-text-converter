# Migration 0002: CRA -> Next.js (App Router)

## Goal

Replace Create React App (`react-scripts`) with Next.js App Router (Next.js 16) while keeping the
app a simple, single-route UI utility.

## Key Changes

- Removed CRA entrypoints and boilerplate:
  - `src/index.js`, `src/App.js`, CRA test scaffolding, and CRA `public/index.html`
- Added Next.js App Router structure:
  - `src/app/layout.tsx`
  - `src/app/page.tsx`
  - `src/app/error.tsx`
  - `src/app/not-found.tsx`
- Moved spoiler conversion logic into a pure module:
  - `src/lib/spoiler.ts`
- Rebuilt UI as client component:
  - `src/components/SpoilerConverter.tsx`

## Metadata + Social

- Migrated from `react-helmet` to Next `metadata` in `src/app/layout.tsx`.
- Added `public/og.png` and referenced it from OpenGraph/Twitter metadata.

## Tailwind CSS v4 Setup

Tailwind v4 is integrated via PostCSS:

- `postcss.config.mjs` uses `@tailwindcss/postcss`
- `src/app/globals.css` includes:

```css
@import "tailwindcss";
```

## Verification

```bash
bun run typecheck
bun run build
bun run dev
```

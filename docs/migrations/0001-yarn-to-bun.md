# Migration 0001: Yarn -> Bun

## Goal

Move the project from Yarn (including PnP artifacts) to Bun as the package manager, with a single
lockfile checked into git (`bun.lock`).

## Changes

- Removed Yarn lockfile: `yarn.lock`
- Removed Yarn/PnP artifacts:
  - `.pnp.cjs`
  - `.pnp.loader.mjs`
  - `.yarn/`
- Updated `.gitignore` to ignore Yarn/PnP artifacts going forward.
- Updated `package.json`:
  - Added `"packageManager": "bun@1.3.10"`
  - Added `"engines": { "node": ">=22.0.0" }`
- Generated `bun.lock` via `bun install`

## Verification

From a clean checkout:

```bash
bun install --frozen-lockfile
```

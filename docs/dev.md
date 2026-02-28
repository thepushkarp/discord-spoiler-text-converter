# Development

## Requirements

- Node.js `>=22` (CI uses Node 22)
- Bun `1.3.10` (see `package.json#packageManager`)

## Common Commands

Install:

```bash
bun install
```

Dev server:

```bash
bun run dev
```

Format:

```bash
bun run format
bun run format:check
```

Lint / types / tests:

```bash
bun run lint
bun run typecheck
bun run test
```

Production build:

```bash
bun run build
```

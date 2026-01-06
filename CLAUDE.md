# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Discord Spoiler Text Converter - A React web app that wraps text in Discord spoiler markdown (`||text||`). Features real-time conversion, live Discord-style preview, and three wrapping modes.

## Commands

```bash
# Development
yarn dev             # Start Vite dev server at localhost:3000

# Build
yarn build           # Production build to build/

# Testing
yarn test            # Run tests in watch mode
yarn test:run        # Run tests once (CI mode)

# Code Quality
yarn format          # Format code with Prettier
yarn format:check    # Check formatting without writing
```

## Architecture

Vite + React 18 + Tailwind CSS structure:

```
src/
├── main.jsx              # Entry point with HelmetProvider
├── App.jsx               # Root component with dark mode toggle, SEO
├── WrapText.jsx          # Main logic: input, mode selection, auto-convert, output
├── Footer.jsx            # Attribution footer
├── index.css             # Tailwind + custom glass/gradient styles
├── hooks/
│   └── useDarkMode.js    # Dark mode state with localStorage persistence
├── components/
│   └── SpoilerPreview.jsx # Live Discord-style spoiler preview
└── test/
    └── setup.js          # Vitest setup
```

### Key Features
- **Auto-convert**: Uses `useMemo` for reactive output - no manual button needed
- **Dark mode**: `useDarkMode` hook with localStorage + system preference fallback
- **Live preview**: `SpoilerPreview` component with clickable spoiler segments
- **Accessibility**: ARIA labels, focus states, live regions for screen readers
- **Keyboard shortcuts**: Ctrl+1/2/3 (modes), Ctrl+Enter (copy), Esc (clear)

### Core Wrapping Functions (WrapText.jsx)
- `wrapCharsWithBars(str)` - Wraps each character: `||a|| ||b||` (spaces preserved)
- `wrapWordsWithBars(str)` - Wraps each word: `||hello|| ||world||`
- `wrapTextWithBars(str)` - Wraps entire string: `||hello world||`

## Code Style

Prettier config (`.prettierrc`): 4-space indentation, single quotes, trailing commas, semicolons.

## Design System

Discord-inspired colors defined in `tailwind.config.js`:
- `discord-dark`, `discord-darker`, `discord-darkest` - Background shades
- `discord-blurple` - Primary accent (#5865f2)
- `discord-green`, `discord-red`, `discord-yellow` - Status colors
- `discord-text`, `discord-text-muted` - Text colors

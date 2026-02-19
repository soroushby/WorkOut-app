# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT: Documentation First

Before generating any code, Claude Code MUST first consult the relevant documentation file(s) in the `/docs` directory. Every coding decision — components, patterns, conventions, styling, database usage, etc. — should be grounded in what the `/docs` files specify. If a relevant doc exists, it takes precedence over defaults or assumptions.

- /docs/ui.md
- /docs/data-fetching.md
- /docs/data-mutations.md
- /docs/auth.md
- /docs/server-components.md
- /docs/routing.md

## Commands

```bash
npm run dev      # Start development server (Next.js on http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Stack

- **Next.js 16** with App Router (`src/app/`)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (configured via PostCSS)

## Architecture

This is a fresh Next.js App Router project. All routes and layouts live under `src/app/`. The entry point is `src/app/page.tsx` with a root layout at `src/app/layout.tsx` that applies Geist fonts and global CSS.

Tailwind CSS v4 is used for styling — utility classes are applied directly in JSX.

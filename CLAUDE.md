# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

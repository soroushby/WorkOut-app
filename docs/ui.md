# UI Coding Standards

## Component Library

**Only shadcn/ui components may be used for UI in this project.**

- Do NOT create custom UI components (buttons, inputs, cards, modals, etc.)
- Do NOT use any other component library (MUI, Chakra, Ant Design, etc.)
- All UI primitives must come from shadcn/ui

If a shadcn/ui component does not yet exist in the project, add it via the CLI:

```bash
npx shadcn@latest add <component-name>
```

Components live in `src/components/ui/` and must not be modified unless fixing a bug introduced by shadcn itself.

## Date Formatting

Date formatting must use **date-fns**.

Dates are displayed with an ordinal day, abbreviated month, and four-digit year:

| Date | Display |
|------|---------|
| 2025-09-01 | 1st Sep 2025 |
| 2025-08-02 | 2nd Aug 2025 |
| 2026-01-03 | 3rd Jan 2026 |
| 2024-06-04 | 4th Jun 2024 |

Use the `do MMM yyyy` format token from date-fns:

```ts
import { format } from "date-fns";

format(date, "do MMM yyyy"); // "1st Sep 2025"
```

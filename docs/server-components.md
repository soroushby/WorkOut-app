# Server Component Standards

## Always `async`

Every page and server component that reads params, search params, or fetches data must be declared `async`.

```tsx
export default async function WorkoutPage({ params }: Props) {
  // ...
}
```

## IMPORTANT: `params` and `searchParams` Are Promises

**This project uses Next.js 16. `params` and `searchParams` are Promises and MUST be awaited before accessing their properties.**

- Do NOT destructure params directly from props without awaiting
- Do NOT access properties on `params` or `searchParams` synchronously
- Always `await` them at the top of the component before using any values

### `params` — dynamic route segments

```tsx
type Props = {
  params: Promise<{ workoutId: string }>;
};

export default async function WorkoutPage({ params }: Props) {
  const { workoutId } = await params;
  // ...
}
```

### `searchParams` — query string values

```tsx
type Props = {
  searchParams: Promise<{ date?: string }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const { date } = await searchParams;
  // ...
}
```

### Example (WRONG — never do this)

```tsx
// ❌ params is a Promise — this will throw or return undefined
export default async function WorkoutPage({ params }: Props) {
  const { workoutId } = params; // ❌ not awaited
  // ...
}
```

## Validating Dynamic Route Params

After awaiting `params`, always validate values before using them.

- Parse numeric IDs with `parseInt` and check for `NaN`
- Call `notFound()` for invalid or missing values rather than throwing

```tsx
import { notFound } from "next/navigation";

const { workoutId: workoutIdParam } = await params;
const workoutId = parseInt(workoutIdParam, 10);

if (isNaN(workoutId)) notFound();
```

## Validating `searchParams`

Search params are user-supplied strings — always validate before use.

- Provide a safe fallback (e.g., `new Date()`) when a param is missing or invalid
- Use `isNaN` after parsing dates or numbers

```tsx
const { date: dateParam } = await searchParams;
const parsedDate = dateParam ? parseISO(dateParam) : new Date();
const date = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
```

## Summary

| Rule | Required |
|------|----------|
| Declare page components `async` | ✅ |
| `await params` before accessing route segments | ✅ |
| `await searchParams` before accessing query values | ✅ |
| Validate dynamic params (parseInt, isNaN, notFound) | ✅ |
| Validate search params and provide fallbacks | ✅ |
| Access `params` or `searchParams` without awaiting | ❌ |

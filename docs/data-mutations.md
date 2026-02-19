# Data Mutation Standards

## IMPORTANT: Server Actions Only

**All data mutations MUST be done exclusively via Next.js Server Actions.**

- Do NOT mutate data via route handlers (API routes)
- Do NOT mutate data directly inside components
- The ONLY acceptable way to mutate data is through a server action

## File Placement: Colocated `actions.ts` Files

Server actions must live in `actions.ts` files colocated with the route or feature they belong to.

- Do NOT put server actions in a single global file
- Do NOT define server actions inline inside components

### Example structure

```
src/
  app/
    dashboard/
      actions.ts       ← server actions for the dashboard route
      page.tsx
    workouts/
      [id]/
        actions.ts     ← server actions for a specific workout
        page.tsx
```

Every `actions.ts` file must begin with the `"use server"` directive:

```ts
"use server";
```

## Database Access: Helper Functions in `/data`

All database writes must go through helper functions in the `src/data/` directory — the same convention as data fetching.

- Do NOT write Drizzle ORM calls inline inside server actions
- Do NOT use raw SQL — all mutations must use **Drizzle ORM**
- Each helper function is responsible for a specific mutation or domain (e.g., `createWorkout`, `deleteSet`)

### Example structure

```
src/
  data/
    workouts.ts    ← contains both query and mutation helpers
    exercises.ts
    sets.ts
```

### Example mutation helper

```ts
// src/data/workouts.ts
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createWorkout(date: string) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthenticated");

  return db.insert(workouts).values({ userId, date }).returning();
}

export async function deleteWorkout(workoutId: string) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthenticated");

  return db
    .delete(workouts)
    .where(eq(workouts.id, workoutId) && eq(workouts.userId, userId));
}
```

## Typed Params — No `FormData`

Server action parameters must be explicitly typed TypeScript values.

- Do NOT accept `FormData` as a parameter
- All params must have explicit TypeScript types

### Example (correct)

```ts
export async function createWorkout(date: string) { ... }
export async function updateSetReps(setId: string, reps: number) { ... }
```

### Example (WRONG — never do this)

```ts
// ❌ FormData is not allowed
export async function createWorkout(formData: FormData) { ... }
```

## Validation: Zod Required on Every Server Action

Every server action **must** validate its arguments with [Zod](https://zod.dev/) before doing anything else.

- Do NOT trust caller-supplied values without parsing them through a Zod schema first
- Define the schema inline at the top of the action, or export it from a colocated `schema.ts` if it is reused

### Example server action with Zod validation

```ts
"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be a valid YYYY-MM-DD date"),
});

export async function createWorkoutAction(date: string) {
  const { date: validatedDate } = createWorkoutSchema.parse({ date });

  return createWorkout(validatedDate);
}
```

## Redirects: Client-Side Only

**Do NOT call `redirect()` inside server actions.**

- Server actions must return data (or nothing) — they must not redirect
- After a server action resolves, perform any navigation in the calling client component using the Next.js router

### Example (correct)

```ts
// actions.ts
export async function createWorkoutAction(name: string, date: string) {
  const { name: validatedName, date: validatedDate } = schema.parse({ name, date });
  return createWorkout(validatedName, startOfDay(parseISO(validatedDate)));
}
```

```tsx
// client component
import { useRouter } from "next/navigation";
import { createWorkoutAction } from "./actions";

const router = useRouter();

async function handleSubmit() {
  await createWorkoutAction(name, date);
  router.push(`/dashboard?date=${date}`);
}
```

### Example (WRONG — never do this)

```ts
// ❌ Do not redirect inside a server action
import { redirect } from "next/navigation";

export async function createWorkoutAction(name: string, date: string) {
  await createWorkout(name, date);
  redirect("/dashboard"); // ❌
}
```

## Security: Always Scope Mutations to the Authenticated User

The same rule that applies to data fetching applies equally to mutations.

- Always obtain the `userId` from the authenticated session inside the `/data` helper (e.g., Clerk's `auth()`)
- Never accept a `userId` as a parameter to a server action or data helper — it could be spoofed by the caller
- Always verify the resource being mutated belongs to the authenticated user before modifying it

### Example (correct)

```ts
// src/data/sets.ts
import { auth } from "@clerk/nextjs/server";

export async function deleteSet(setId: string) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthenticated");

  // Join to verify ownership before deleting
  const set = await db.query.sets.findFirst({
    where: (s, { eq }) => eq(s.id, setId),
    with: { workout: true },
  });

  if (set?.workout.userId !== userId) throw new Error("Forbidden");

  return db.delete(sets).where(eq(sets.id, setId));
}
```

### Example (WRONG — never do this)

```ts
// ❌ Never accept userId from the caller
export async function deleteSet(setId: string, userId: string) {
  return db.delete(sets).where(eq(sets.id, setId));
}
```

## Summary

| Rule | Required |
|------|----------|
| Mutate data via server actions only | ✅ |
| Colocate server actions in `actions.ts` next to the route | ✅ |
| Use helper functions in `src/data/` for all DB writes | ✅ |
| Use Drizzle ORM (no raw SQL) | ✅ |
| Use explicit TypeScript types for all action params | ✅ |
| Validate all action params with Zod | ✅ |
| Scope all mutations to the authenticated user | ✅ |
| Redirect client-side after a server action resolves | ✅ |
| Use `redirect()` inside server actions | ❌ |
| Use `FormData` as action params | ❌ |
| Write Drizzle calls inline in server actions | ❌ |
| Put all server actions in a single global file | ❌ |
| Mutate data via route handlers | ❌ |
| Trust client-supplied user IDs | ❌ |
| Use raw SQL | ❌ |

# Data Fetching Standards

## IMPORTANT: Server Components Only

**All data fetching MUST be done exclusively via React Server Components.**

- Do NOT fetch data in client components
- Do NOT fetch data via route handlers (API routes)
- Do NOT use `useEffect`, SWR, React Query, or any client-side fetching pattern
- The ONLY acceptable way to fetch data is inside a `async` server component

## Database Access: Helper Functions in `/data`

All database queries must go through helper functions located in the `/data` directory.

- Do NOT write database queries inline in components
- Do NOT use raw SQL — all queries must use **Drizzle ORM**
- Each helper function is responsible for a specific query or domain (e.g., `getWorkoutsForUser`)

### Example structure

```
src/
  data/
    workouts.ts
    exercises.ts
    sets.ts
```

### Example helper function

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

### Example server component consuming the helper

```ts
// src/app/dashboard/page.tsx
import { getWorkoutsForUser } from "@/data/workouts";

export default async function DashboardPage() {
  const workouts = await getWorkoutsForUser(userId);
  // ...
}
```

## Security: Users May Only Access Their Own Data

This is critical. Every helper function that queries user-scoped data **must** filter by `userId`.

- Always obtain the `userId` from the authenticated session (e.g., Clerk's `auth()`) inside the helper or pass it in from the server component
- Never accept a `userId` from user input, query params, or any client-supplied value
- Never return data without scoping it to the authenticated user

### Example (correct)

```ts
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsForUser() {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthenticated");

  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

### Example (WRONG — never do this)

```ts
// ❌ Never trust a userId from outside — anyone could pass any userId
export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

## Summary

| Rule | Required |
|------|----------|
| Fetch data in server components only | ✅ |
| Use helper functions in `/data` | ✅ |
| Use Drizzle ORM (no raw SQL) | ✅ |
| Scope all queries to the authenticated user | ✅ |
| Fetch data in client components | ❌ |
| Fetch data via route handlers | ❌ |
| Use raw SQL | ❌ |
| Trust client-supplied user IDs | ❌ |

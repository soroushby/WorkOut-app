# Authentication Standards

## Provider: Clerk

**This app uses [Clerk](https://clerk.com) exclusively for authentication.**

- Do NOT implement custom authentication (sessions, JWTs, bcrypt, etc.)
- Do NOT use NextAuth, Auth.js, or any other auth library
- All authentication must go through Clerk's SDK

## Installation

Clerk is available via the Next.js SDK:

```bash
npm install @clerk/nextjs
```

## Environment Variables

The following Clerk environment variables must be set:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

## Middleware: Protecting Routes

Use Clerk's `clerkMiddleware` in `src/proxy.ts` to protect routes.

**In Next.js 16, the middleware file is `src/proxy.ts` — do NOT use `src/middleware.ts`.**

```ts
// src/proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

- All routes are protected by default unless explicitly listed as public
- Do NOT skip middleware for authenticated areas

## Getting the Current User

### In server components and data helpers

Use `auth()` from `@clerk/nextjs/server`:

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();

if (!userId) throw new Error("Unauthenticated");
```

### In client components

Use the `useAuth` or `useUser` hooks from `@clerk/nextjs`:

```ts
"use client";
import { useUser } from "@clerk/nextjs";

const { user } = useUser();
```

Only use client-side hooks for UI purposes (e.g., displaying the user's name or avatar). Never use client-side auth for data access decisions.

## Sign In / Sign Up UI

Use Clerk's hosted components — do NOT build custom sign-in or sign-up forms.

```tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return <SignIn />;
}
```

Standard route conventions:

| Route | Component |
|-------|-----------|
| `/sign-in` | `<SignIn />` |
| `/sign-up` | `<SignUp />` |

## User Button

Use Clerk's `<UserButton />` for the account menu in the app header:

```tsx
import { UserButton } from "@clerk/nextjs";

<UserButton />
```

Do NOT build a custom account dropdown or avatar component.

## Security Rules

- Always obtain `userId` from `auth()` on the server — never from client input, query params, or props
- Never expose `CLERK_SECRET_KEY` to the client
- Never bypass `auth.protect()` for authenticated routes
- Never render protected content without first verifying the session server-side

## Summary

| Rule | Required |
|------|----------|
| Use Clerk for all authentication | ✅ |
| Protect routes via `clerkMiddleware` | ✅ |
| Get `userId` from `auth()` on the server | ✅ |
| Use `<SignIn />` and `<SignUp />` for auth UI | ✅ |
| Use `<UserButton />` for the account menu | ✅ |
| Custom auth implementation | ❌ |
| Trust client-supplied user identity | ❌ |
| Use other auth libraries | ❌ |

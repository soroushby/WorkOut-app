# Routing Standards

## All App Routes Live Under `/dashboard`

Every page in this application (beyond the public landing/auth pages) must be nested under `/dashboard`.

- Do NOT create top-level app routes for authenticated features (e.g. `/workouts`, `/profile`)
- All authenticated functionality belongs under `/dashboard` or a sub-path of it

### Route structure

```
/                          ← public landing page
/sign-in                   ← public, handled by Clerk
/sign-up                   ← public, handled by Clerk
/dashboard                 ← protected: workout diary home
/dashboard/workout/new     ← protected: create a new workout
/dashboard/workout/[id]    ← protected: edit a workout
```

## Route Protection via Middleware

**All `/dashboard` routes MUST be protected via Next.js middleware.**

- Do NOT rely on per-page auth checks as the primary protection mechanism
- Do NOT protect routes inside individual page components using redirects
- The middleware is the single, authoritative enforcement point for authentication

**In Next.js 16, the middleware file is `src/proxy.ts` (not `middleware.ts`).** Do NOT create a `src/middleware.ts` — Next.js 16 will error if both files exist.

The proxy must use Clerk's `clerkMiddleware`:

```ts
// src/proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  // Redirect signed-in users away from the homepage to the dashboard
  if (req.nextUrl.pathname === "/") {
    const { userId } = await auth();
    if (userId) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

- Any route not listed in `isPublicRoute` is automatically protected
- Adding a new page under `/dashboard` requires no additional protection code — the middleware covers it
- To make a route public, explicitly add it to the `isPublicRoute` matcher

## Adding New Routes

When adding a new page to the app:

1. Place it under `src/app/dashboard/`
2. No additional auth code is needed — middleware handles protection automatically
3. Update this doc if a new public route is introduced

## Summary

| Rule | Required |
|------|----------|
| All authenticated routes under `/dashboard` | ✅ |
| Route protection via `src/middleware.ts` | ✅ |
| Use `clerkMiddleware` with an explicit public route allowlist | ✅ |
| Top-level routes for authenticated features | ❌ |
| Per-page redirect logic as the primary auth guard | ❌ |
| Leaving `/dashboard` routes unprotected | ❌ |

# Habit Tracker PWA

## Project Overview

Habit Tracker is a mobile-first Progressive Web App built with Next.js App Router and TypeScript.  
It supports local account signup/login, user-scoped habit tracking, streak calculation, and offline app shell loading through a service worker.

## Setup Instructions

1. Install dependencies:

```bash
pnpm install
```

2. Install Playwright browsers (first-time only):

```bash
pnpm exec playwright install
```

## Run Instructions

Start development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Test Instructions

Run unit tests with coverage:

```bash
pnpm test:unit
```

Run integration tests:

```bash
pnpm test:integration
```

Run end-to-end tests:

```bash
pnpm test:e2e
```

Run all tests:

```bash
pnpm test
```

## Local Persistence Structure

The app stores all data in `localStorage` using these keys:

- `habit-tracker-users`: array of users
  - `{ id, email, password, createdAt }`
- `habit-tracker-session`: active session or `null`
  - `{ userId, email }`
- `habit-tracker-habits`: array of habits
  - `{ id, userId, name, description, frequency, createdAt, completions }`

`completions` is an array of unique ISO calendar dates (`YYYY-MM-DD`).

## PWA Implementation

PWA support is implemented with:

- `public/manifest.json` with app metadata and required icons
- `public/icons/icon-192.png` and `public/icons/icon-512.png`
- `public/sw.js` service worker for app shell caching and offline-safe navigation handling
- `src/components/shared/ServiceWorkerRegistration.tsx` for client-side SW registration
- manifest and viewport metadata set in `src/app/layout.tsx`

Behavior:

- App is installable in supported browsers.
- App shell routes are cached after first load.
- Offline revisit does not hard-crash and serves cached shell routes.

## Trade-offs and Limitations

- Authentication is local-only and not secure for production.
- Data is device/browser scoped and can be cleared by the user.
- No backend sync, cross-device sync, or account recovery.
- Service worker strategy is intentionally simple for deterministic stage requirements.
- Tests are optimized for deterministic local behavior and PRD contract compliance.

## Required Test Mapping

- `tests/unit/slug.test.ts`
  - verifies slug generation rules for habit card test IDs
- `tests/unit/validators.test.ts`
  - verifies habit name validation constraints and exact error messages
- `tests/unit/streaks.test.ts`
  - verifies deterministic streak calculation behavior
- `tests/unit/habits.test.ts`
  - verifies completion toggling immutability and persistence helpers
- `tests/integration/auth-flow.test.tsx`
  - verifies signup/login flows and session behavior at component level
- `tests/integration/habit-form.test.tsx`
  - verifies create/edit/delete/toggle behavior from dashboard interactions
- `tests/e2e/app.spec.ts`
  - verifies route protection, splash redirects, auth flow, habit lifecycle, persistence, logout, and offline cached shell behavior in browser

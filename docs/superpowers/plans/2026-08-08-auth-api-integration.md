# Authentication API Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete frontend login, session restoration, refresh-token rotation, and logout against the MailMetric API.

**Architecture:** Put response parsing and token persistence in a testable `lib/auth-api.ts` boundary. The permission provider owns in-memory user/session state and uses that boundary for login, refresh-once restoration, and logout; the top bar exposes logout.

**Tech Stack:** Next.js 14, React 18, strict TypeScript, Node test runner via `tsx`.

## Global Constraints

- Use relative `/api` URLs through the Next.js proxy.
- Store access token as `mm_access_token` and refresh token as `mm_refresh_token`.
- Refresh at most once after `/auth/me` returns 401.
- Always clear local state after logout, even when the API request fails.
- Do not implement signup, OTP, forgot/reset password, or social login.

---

### Task 1: Tested auth API boundary

**Files:**
- Create: `lib/auth-api.ts`
- Create: `lib/auth-api.test.ts`

**Interfaces:**
- Produces: `parseAuthSession(value: unknown): AuthSession | null`
- Produces: `readStoredTokens`, `storeTokens`, and `clearStoredTokens`
- Produces: `loginRequest`, `profileRequest`, `refreshRequest`, and `logoutRequest`

- [ ] **Step 1: Write failing parser and storage tests**

Assert a complete backend response parses into access token, refresh token, and normalized user; malformed responses return `null`. Use an in-memory `Storage` double and assert both token keys are written, read, and cleared.

- [ ] **Step 2: Verify RED**

Run: `npm test`

Expected: failure because `auth-api.ts` does not exist.

- [ ] **Step 3: Implement the boundary**

Define `AuthSession`, parse `accessToken` or compatibility `token`, require `refreshToken`, and normalize users with the existing role helper. Implement fetch calls for the four backend endpoints with one shared JSON error-message reader.

- [ ] **Step 4: Verify GREEN and commit**

Run: `npm test`

Expected: parser/storage tests and existing routing tests pass.

```bash
git add lib/auth-api.ts lib/auth-api.test.ts
git commit -m "feat: add auth API client"
```

### Task 2: Provider refresh and logout lifecycle

**Files:**
- Modify: `context/PermissionContext.tsx`
- Modify: `types/rbac.ts`
- Modify: `components/dashboard/Topbar.tsx`

**Interfaces:**
- Consumes: auth API boundary from Task 1
- Produces: login, refresh-once restoration, and asynchronous logout behavior

- [ ] **Step 1: Change the provider contract**

Make `logout(): Promise<void>` and preserve the existing login result destination contract.

- [ ] **Step 2: Implement session restoration**

Read both stored tokens. If either is absent, finish unauthenticated. Call `/auth/me`; on 401 call refresh once, store rotated tokens, and use the refreshed user or retry profile once. Any failure clears storage and state.

- [ ] **Step 3: Implement login and logout through the boundary**

Login stores both tokens and normalized user. Logout calls `/auth/logout` with both tokens when available, then clears state/storage in `finally`.

- [ ] **Step 4: Add the top-bar logout control**

Add a Logout button that awaits `logout()` and routes to `/login` with `router.replace`.

- [ ] **Step 5: Verify and commit**

Run: `npm test`

Run: `npm run typecheck`

Expected: all tests and strict TypeScript pass.

```bash
git add context/PermissionContext.tsx types/rbac.ts components/dashboard/Topbar.tsx
git commit -m "feat: complete auth session lifecycle"
```

### Task 3: Full verification and publication

**Files:**
- Modify only for an in-scope verification defect.

- [ ] **Step 1: Run tests**

Run: `npm test`

Expected: all auth, routing, and navigation tests pass.

- [ ] **Step 2: Run checks sequentially**

Run: `npm run build`

Run: `npm run typecheck`

Expected: both exit 0; do not run concurrently because both use `.next/types`.

- [ ] **Step 3: Inspect and publish**

Run `git diff --check` and confirm the clean intended history, then use the standing instruction to push `main` to `origin/main`.

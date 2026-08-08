# Separated Dashboards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add separate Super Admin and user dashboard shells while allowing every authenticated MVP role to access both.

**Architecture:** Centralize backend-role normalization and default landing selection in pure functions, then make the permission provider restore real sessions instead of creating a demo Super Admin. Add a shared authentication gate and a dedicated `/super-admin` route tree; both dashboard trees reuse existing feature routes and remain accessible to every authenticated role.

**Tech Stack:** Next.js 14 App Router, React 18, strict TypeScript, Node test runner through `tsx`.

## Global Constraints

- Every authenticated role may access both `/super-admin` and `/dashboard`.
- `/super-admin` is the default landing area for `superadmin` and `admin`.
- `/dashboard` is the default landing area for `user`, `client`, and `sub_user`.
- Unauthenticated visitors are redirected to `/login`.
- Do not duplicate existing feature-page implementations.
- Remove the default fake Super Admin session and normal-runtime role switcher.

---

### Task 1: Role normalization and default routing

**Files:**
- Create: `lib/auth-routing.ts`
- Create: `lib/auth-routing.test.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Produces: `normalizeRole(value: unknown): UserRole | null`
- Produces: `getDefaultDashboard(role: UserRole): '/super-admin' | '/dashboard'`

- [ ] **Step 1: Add the test runner and failing pure-function tests**

Install `tsx` as a dev dependency and add `"test": "tsx --test \"lib/**/*.test.ts\""`.

Write literal table-driven assertions:

```ts
assert.equal(normalizeRole('superadmin'), 'Super Admin');
assert.equal(normalizeRole('admin'), 'Admin');
assert.equal(normalizeRole('client'), 'User');
assert.equal(normalizeRole('user'), 'User');
assert.equal(normalizeRole('sub_user'), 'Sub User');
assert.equal(normalizeRole('unknown'), null);
assert.equal(getDefaultDashboard('Super Admin'), '/super-admin');
assert.equal(getDefaultDashboard('Admin'), '/super-admin');
assert.equal(getDefaultDashboard('User'), '/dashboard');
assert.equal(getDefaultDashboard('Sub User'), '/dashboard');
```

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test`

Expected: failure because `auth-routing.ts` and its exports do not exist.

- [ ] **Step 3: Implement the pure functions**

Use an explicit lowercased role map. Accept frontend display names as inputs too so restored/demo-independent data remains stable. Return `null` for unrecognized values and select `/super-admin` only for `Super Admin` or `Admin`.

- [ ] **Step 4: Verify GREEN and commit**

Run: `npm test`

Expected: all routing tests pass.

```bash
git add lib/auth-routing.ts lib/auth-routing.test.ts package.json package-lock.json
git commit -m "feat: normalize dashboard roles"
```

### Task 2: Real authentication state and redirects

**Files:**
- Modify: `context/PermissionContext.tsx`
- Modify: `types/rbac.ts`
- Modify: `app/login/page.tsx`
- Modify: `components/dashboard/Topbar.tsx`

**Interfaces:**
- Consumes: `normalizeRole` and `getDefaultDashboard` from Task 1
- Produces: a provider with `user: null` initially, `loading: true` during restoration, normalized backend profiles, and successful login results containing the destination

- [ ] **Step 1: Extend the authentication result contract**

Change successful `AuthResult` to include:

```ts
{ success: true; destination: '/super-admin' | '/dashboard' }
```

Failures remain `{ success: false; error: string }`.

- [ ] **Step 2: Normalize backend profiles**

Replace the current permissive `isRbacUser` path with a parser that accepts backend `id` or `_id`, `fullName` or `name`, role strings, and permission arrays. Call `normalizeRole`; reject profiles with unknown roles. Use relative `/api/auth/me` and `/api/auth/login` URLs so Next rewrites handle the backend origin.

- [ ] **Step 3: Remove demo authentication defaults**

Initialize `user` to `null` and `loading` to `true`. On mount, restore `mm_token`; if absent, finish loading unauthenticated. If profile restoration fails, clear the token and user. Remove `switchRoleDemo` from the provider contract and remove the role-switcher controls from `Topbar`.

- [ ] **Step 4: Make login use the real provider**

Submit the login form through `login(email, password)`. On success call `router.replace(result.destination)`; on failure render the returned error and retain the form values.

- [ ] **Step 5: Verify and commit**

Run: `npm test`

Run: `npm run typecheck`

Expected: routing tests and strict TypeScript pass.

```bash
git add context/PermissionContext.tsx types/rbac.ts app/login/page.tsx components/dashboard/Topbar.tsx
git commit -m "feat: route authenticated users by role"
```

### Task 3: Authentication gate and separate shells

**Files:**
- Create: `components/rbac/AuthenticatedRoute.tsx`
- Create: `components/super-admin/SuperAdminShell.tsx`
- Create: `components/super-admin/SuperAdminSidebar.tsx`
- Create: `app/super-admin/layout.tsx`
- Create: `app/super-admin/page.tsx`
- Modify: `components/dashboard/DashboardShell.tsx`
- Modify: `components/dashboard/Sidebar.tsx`

**Interfaces:**
- Consumes: `loading`, `token`, `user`, and `logout` from the permission context
- Produces: authenticated `/dashboard` and `/super-admin` shells available to all recognized roles

- [ ] **Step 1: Add the shared authentication gate**

Create a client component that renders a centered loading state while restoration runs, calls `router.replace('/login')` when loading is complete without both token and user, and otherwise renders children. Do not inspect roles in this gate.

- [ ] **Step 2: Protect the existing user shell**

Wrap `DashboardShell` content with `AuthenticatedRoute`. Simplify its sidebar navigation to user-focused links: dashboard, single validation, bulk validation, history, subscription, settings, and a visible link to `/super-admin`.

- [ ] **Step 3: Add the Super Admin shell and navigation**

Create a separate shell with its own sidebar and existing `Topbar`. Its links are `/super-admin`, `/dashboard/users`, `/dashboard/disposable`, `/dashboard/analytics`, `/dashboard/settings`, `/dashboard/validation/single`, `/dashboard/validation/bulk`, and a visible link back to `/dashboard`.

- [ ] **Step 4: Add the Super Admin overview page**

Create an overview with navigation cards for Users, Disposable Domains, Analytics, Settings, Single Validation, and Bulk Validation. Cards link to shared existing pages; do not copy those page components.

- [ ] **Step 5: Verify and commit**

Run: `npm run typecheck`

Run: `npm run build`

Expected: both dashboard route trees compile and `/super-admin` is statically generated as a client-authenticated shell.

```bash
git add components/rbac/AuthenticatedRoute.tsx components/super-admin app/super-admin components/dashboard/DashboardShell.tsx components/dashboard/Sidebar.tsx
git commit -m "feat: separate super admin and user dashboards"
```

### Task 4: Full verification and publication

**Files:**
- Modify only when a verification failure identifies an in-scope defect.

**Interfaces:**
- Consumes: Tasks 1–3
- Produces: a verified frontend `main` branch synchronized with `origin/main`

- [ ] **Step 1: Run routing tests**

Run: `npm test`

Expected: role normalization and destination tests pass with zero failures.

- [ ] **Step 2: Run frontend checks sequentially**

Run: `npm run build`

Run: `npm run typecheck`

Expected: both exit 0. Do not run concurrently because both use `.next/types`.

- [ ] **Step 3: Inspect and publish**

Run `git diff --check` and `git status -sb`. Confirm only intended commits exist, then follow the standing instruction with `git push origin main`.

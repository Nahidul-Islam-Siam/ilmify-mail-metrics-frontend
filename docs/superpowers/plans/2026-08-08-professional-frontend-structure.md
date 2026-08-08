# Professional Frontend Structure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize the frontend into URL-neutral route groups and responsibility-based Redux, API, feature, layout, and type folders without changing behavior or styling.

**Architecture:** Next.js routes move under `(common)`, `(auth)`, and `(dashboard)` groups while retaining their public paths. Redux state, API transport, auth domain behavior, feature types, and reusable layouts receive explicit dependency boundaries and use the `@/` alias for stable imports.

**Tech Stack:** Next.js 14 App Router, React 18, strict TypeScript, Redux Toolkit 2, React Redux 9, Redux Persist 6, Node test runner through `tsx`.

## Global Constraints

- Preserve `/`, `/login`, `/forgot-password`, `/dashboard/*`, and `/super-admin` URLs.
- Remove duplicate `/auth/*` routes.
- Do not change runtime behavior or visual styling.
- Keep Redux state management under `redux/` only.
- Keep backend transport under `services/api/`; API modules must not import Redux.
- Persist only the auth user, access token, and refresh token.
- Keep route `layout.tsx` files as thin adapters around named layout components.

---

### Task 1: Stable Import Alias and API Service Boundary

**Files:**
- Modify: `tsconfig.json`
- Move: `lib/api-url.ts` -> `services/api/apiUrl.ts`
- Move: `lib/api-url.test.ts` -> `services/api/apiUrl.test.ts`
- Move: `lib/auth-api.ts` -> `services/api/authApi.ts`
- Move: `lib/auth-api.test.ts` -> `services/api/authApi.test.ts`
- Move: `lib/api.ts` -> `services/api/validationApi.ts`
- Modify: all consumers of the moved API modules

**Interfaces:**
- Produces: `@/*` resolving from the repository root, `buildApiUrl`, auth request functions/types, and validation request functions under `services/api/`.
- Preserves: every existing exported API function and response contract.

- [ ] **Step 1: Capture the green API baseline**

Run: `npx tsx --test lib/api-url.test.ts lib/auth-api.test.ts`

Expected: all API boundary tests PASS before the move.

- [ ] **Step 2: Add the stable alias**

Add to `compilerOptions`:

```json
"baseUrl": ".",
"paths": { "@/*": ["./*"] }
```

- [ ] **Step 3: Move API modules and update imports**

Move the five files to `services/api/`, rename them as listed, and use imports such as:

```ts
import { loginRequest } from '@/services/api/authApi';
import { validateSingleEmail } from '@/services/api/validationApi';
import { buildApiUrl } from '@/services/api/apiUrl';
```

`authApi.ts` imports auth types from their current location until Task 3. `validationApi.ts` imports validation types from their current location until Task 3. No service module may import from `redux/`, `app/`, or `components/`.

- [ ] **Step 4: Verify the relocated API tests and types**

Run: `npx tsx --test services/api/apiUrl.test.ts services/api/authApi.test.ts`

Run: `npm run typecheck`

Expected: both commands PASS.

- [ ] **Step 5: Commit the API boundary**

```bash
git add tsconfig.json lib services app components store hooks
git commit -m "refactor: organize frontend API services"
```

### Task 2: Feature-Organized Redux Directory

**Files:**
- Move: `store/store.ts` -> `redux/store.ts`
- Move: `store/hooks.ts` -> `redux/hooks.ts`
- Move: `components/StoreProvider.tsx` -> `redux/provider.tsx`
- Move: `store/authSlice.ts` -> `redux/features/auth/authSlice.ts`
- Move: `store/authSlice.test.ts` -> `redux/features/auth/authSlice.test.ts`
- Move: `store/authPersist.ts` -> `redux/features/auth/authPersist.ts`
- Move: `store/authPersist.test.ts` -> `redux/features/auth/authPersist.test.ts`
- Move: `store/validationSlice.ts` -> `redux/features/validation/validationSlice.ts`
- Modify: all Redux consumers

**Interfaces:**
- Produces: `makeStore`, `AppStore`, `RootState`, `AppDispatch`, typed hooks, `ReduxProvider`, auth state operations, and validation state operations under `redux/`.
- Consumes: API functions only through `@/services/api/*`.

- [ ] **Step 1: Capture the green Redux baseline**

Run: `npx tsx --test store/authSlice.test.ts store/authPersist.test.ts`

Expected: all Redux tests PASS before the move.

- [ ] **Step 2: Move Redux files into feature folders**

Move and rename files exactly as listed. Rename the default provider export and component to `ReduxProvider`. Update internal imports to stable aliases:

```ts
import { loginRequest } from '@/services/api/authApi';
import authReducer from '@/redux/features/auth/authSlice';
import validationReducer from '@/redux/features/validation/validationSlice';
```

- [ ] **Step 3: Update application consumers**

Update the root layout to import `ReduxProvider` from `@/redux/provider`. Update `LiveValidator`, validation routes, and auth feature consumers to import typed hooks/actions from `@/redux/*`.

- [ ] **Step 4: Verify Redux isolation**

Run: `npx tsx --test redux/features/auth/authSlice.test.ts redux/features/auth/authPersist.test.ts`

Run: `npm run typecheck`

Expected: both commands PASS and the old `store/` directory is absent.

- [ ] **Step 5: Commit Redux organization**

```bash
git add redux store components/StoreProvider.tsx components app hooks
git commit -m "refactor: organize Redux state by feature"
```

### Task 3: Auth and Validation Feature Boundaries

**Files:**
- Move: `hooks/usePermission.ts` -> `features/auth/usePermission.ts`
- Move: `lib/permission-helpers.ts` -> `features/auth/permissionHelpers.ts`
- Move: `lib/permission-helpers.test.ts` -> `features/auth/permissionHelpers.test.ts`
- Move: `types/rbac.ts` -> `features/auth/types.ts`
- Move: `types/validation.ts` -> `features/validation/types.ts`
- Move: `components/email-validation/*` -> `features/validation/components/*`
- Modify: every consumer of moved feature code

**Interfaces:**
- Produces: auth permission types/helpers/hook under `features/auth/` and validation types/components under `features/validation/`.
- Consumes: Redux through `@/redux/*` and API transport through `@/services/api/*`.

- [ ] **Step 1: Capture the green feature baseline**

Run: `npx tsx --test lib/permission-helpers.test.ts lib/auth-routing.test.ts`

Expected: permission and auth-routing tests PASS before the move.

- [ ] **Step 2: Move auth domain files and update consumers**

Move auth types, helpers, tests, and `usePermission` exactly as listed. Update guards, layouts, dashboard pages, API parsing, and Redux auth imports to `@/features/auth/*`. Preserve the `usePermission(): PermissionContextValue` contract.

- [ ] **Step 3: Move validation domain files and update consumers**

Move validation types and components exactly as listed. Update validation API, Redux validation state, landing validator, and validation pages to import through `@/features/validation/*`.

- [ ] **Step 4: Verify feature boundaries**

Run: `npx tsx --test features/auth/permissionHelpers.test.ts lib/auth-routing.test.ts`

Run: `npm run typecheck`

Expected: both commands PASS; old `hooks/usePermission.ts`, `types/rbac.ts`, `types/validation.ts`, and `components/email-validation/` paths are absent.

- [ ] **Step 5: Commit feature organization**

```bash
git add features hooks lib types components app redux services
git commit -m "refactor: organize auth and validation features"
```

### Task 4: Named Layout Components

**Files:**
- Create: `components/layouts/CommonLayout.tsx`
- Create: `components/layouts/AuthLayout.tsx`
- Move: `components/dashboard/DashboardShell.tsx` -> `components/layouts/DashboardLayout.tsx`
- Move: `components/super-admin/SuperAdminShell.tsx` -> `components/layouts/SuperAdminLayout.tsx`
- Modify: dashboard and Super Admin layout consumers

**Interfaces:**
- Produces: `CommonLayout`, `AuthLayout`, `DashboardLayout`, and `SuperAdminLayout`, each accepting `ChildrenProps`.
- Preserves: existing dashboard and Super Admin shell markup and styles.

- [ ] **Step 1: Capture the green layout/navigation baseline**

Run: `npx tsx --test lib/dashboard-navigation.test.ts`

Expected: dashboard navigation tests PASS.

- [ ] **Step 2: Create common and auth layout components**

Implement behavior-neutral wrappers:

```tsx
export function CommonLayout({ children }: ChildrenProps) {
  return children;
}

export function AuthLayout({ children }: ChildrenProps) {
  return children;
}
```

- [ ] **Step 3: Move and rename authenticated layout components**

Move the existing shell implementations to the layout folder and rename their component exports. Preserve their rendered JSX, class names, sidebar/topbar composition, and access guards exactly.

- [ ] **Step 4: Verify named layouts compile**

Run: `npm run typecheck`

Expected: PASS with no imports of `DashboardShell`, `SuperAdminShell`, or `components/StoreProvider`.

- [ ] **Step 5: Commit named layouts**

```bash
git add components/layouts components/dashboard/DashboardShell.tsx components/super-admin/SuperAdminShell.tsx app
git commit -m "refactor: establish named application layouts"
```

### Task 5: Next.js Route Groups and Duplicate Route Removal

**Files:**
- Move: `app/page.tsx` -> `app/(common)/page.tsx`
- Create: `app/(common)/layout.tsx`
- Move: `app/login/page.tsx` -> `app/(auth)/login/page.tsx`
- Move: `app/forgot-password/page.tsx` -> `app/(auth)/forgot-password/page.tsx`
- Create: `app/(auth)/layout.tsx`
- Move: `app/dashboard/**` -> `app/(dashboard)/dashboard/**`
- Move: `app/super-admin/**` -> `app/(dashboard)/super-admin/**`
- Delete: `app/auth/**`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: URL-neutral `(common)`, `(auth)`, and `(dashboard)` route groups.
- Preserves: canonical route URLs and all current route component exports.

- [ ] **Step 1: Record the current production route manifest**

Run: `npm run build`

Record that the build includes `/`, `/login`, `/forgot-password`, `/dashboard`, `/dashboard/validation/single`, `/dashboard/validation/bulk`, and `/super-admin`, while also showing the duplicate `/auth/*` routes that this task removes.

- [ ] **Step 2: Move canonical routes into route groups**

Move the canonical files/directories exactly as listed. Add thin adapters:

```tsx
export default function Layout({ children }: Readonly<ChildrenProps>) {
  return <CommonLayout>{children}</CommonLayout>;
}
```

Use `AuthLayout` for `(auth)`. The dashboard and Super Admin route layouts render `DashboardLayout` and `SuperAdminLayout` respectively. Update moved route imports to `@/` aliases so route-group depth never affects imports.

- [ ] **Step 3: Remove duplicate authentication routes**

Delete `app/auth/` including signup, OTP, reset-password, duplicate login, duplicate forgot-password, its layout, and its CSS. These routes are outside the approved MVP authentication scope.

- [ ] **Step 4: Verify the new route manifest**

Run: `npm run build`

Expected: build PASS; the manifest includes the canonical routes from Step 1 and contains no `/auth/login`, `/auth/signup`, `/auth/verify-otp`, `/auth/reset-password`, or `/auth/forgot-password` entries.

- [ ] **Step 5: Commit route groups**

```bash
git add app components/layouts
git commit -m "refactor: organize routes with Next.js groups"
```

### Task 6: Full Verification and Direct-Main Delivery

**Files:**
- Verify all moved and modified frontend files.

**Interfaces:**
- Consumes: the completed professional folder structure.
- Produces: verified and synchronized frontend `main`.

- [ ] **Step 1: Run the complete automated test suite**

Run: `npm test`

Expected: zero failures.

- [ ] **Step 2: Run strict TypeScript checking**

Run: `npm run typecheck`

Expected: exit code 0.

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: all canonical routes compile and duplicate `/auth/*` routes are absent.

- [ ] **Step 4: Verify dependency and Git integrity**

Run: `rg -n "from ['\"]@/(app|components).*redux|from ['\"]@/redux" services/api`

Expected: no output.

Run: `git diff --check`

Run: `git status -sb`

Expected: no whitespace errors and only intended changes or a clean tree.

- [ ] **Step 5: Push the approved direct-main work**

Run: `git push origin main`

Expected: local `main` and `origin/main` point to the same commit.

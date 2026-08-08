# Redux Authentication Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move authentication and permission state to Redux Toolkit and persist only authenticated session fields with Redux Persist.

**Architecture:** An `authSlice` owns the session lifecycle through typed async thunks. A nested Redux Persist configuration saves only the user and token fields, while `usePermission()` remains a compatibility adapter for existing UI consumers.

**Tech Stack:** Next.js 14, React 18, TypeScript strict mode, Redux Toolkit 2, React Redux 9, Redux Persist 6, Node test runner through `tsx`.

## Global Constraints

- Persist only `auth.user`, `auth.accessToken`, and `auth.refreshToken`.
- Do not persist validation state, loading state, initialization state, or errors.
- Restore through `/api/auth/me`, refresh exactly once after a `401`, and clear the session after terminal failure.
- Logout must clear local Redux state even when the backend request fails.
- Preserve the existing `usePermission()` API and role-based destinations.
- Do not add OTP, registration, password recovery, or social authentication.

---

### Task 1: Auth State Reducer and Lifecycle Thunks

**Files:**
- Create: `store/authSlice.ts`
- Create: `store/authSlice.test.ts`
- Modify: `lib/auth-api.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `loginRequest`, `profileRequest`, `refreshRequest`, `logoutRequest`, `AuthApiError`, and `AuthSession` from `lib/auth-api.ts`.
- Produces: `AuthState`, `loginThunk`, `restoreSessionThunk`, `logoutThunk`, `updateUser`, `clearSession`, and the auth reducer.

- [ ] **Step 1: Write failing reducer and lifecycle tests**

Add tests that dispatch the generated fulfilled/rejected actions directly and assert literal state outcomes:

```ts
test('login fulfillment stores the complete session', () => {
  const next = authReducer(initialAuthState, loginThunk.fulfilled(session, 'request', credentials));
  assert.equal(next.accessToken, 'access-1');
  assert.equal(next.refreshToken, 'refresh-1');
  assert.equal(next.user?.role, 'Admin');
  assert.equal(next.loading, false);
});

test('terminal restoration failure clears persisted session fields', () => {
  const next = authReducer(existingSession, restoreSessionThunk.rejected(null, 'request', tokens, 'expired'));
  assert.equal(next.user, null);
  assert.equal(next.accessToken, null);
  assert.equal(next.refreshToken, null);
  assert.equal(next.initialized, true);
});
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `npx tsx --test store/authSlice.test.ts`

Expected: FAIL because `store/authSlice.ts` does not exist.

- [ ] **Step 3: Implement the auth slice and thunks**

Define:

```ts
export interface AuthState {
  user: RbacUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
}
```

`loginThunk` returns `AuthSession`. `restoreSessionThunk` accepts `AuthTokens`, calls `profileRequest`, and returns the existing tokens plus the profile. It catches only `AuthApiError` status `401`, calls `refreshRequest` once, and returns that rotated session. `logoutThunk` accepts `AuthTokens | null`, calls the backend when non-null, catches backend errors, and returns normally so cleanup always runs.

Reducers must set request flags deterministically. Login rejection sets a readable error without creating a session. Restore rejection clears all session fields and marks `initialized`. Logout fulfillment clears all session fields. `updateUser` merges `Partial<RbacUser>` only when a user exists.

Expand the test script to `tsx --test "**/*.test.ts"` so store tests are part
of every full test run.

- [ ] **Step 4: Run focused and existing tests**

Run: `npx tsx --test store/authSlice.test.ts lib/auth-api.test.ts lib/auth-routing.test.ts`

Expected: all tests PASS.

- [ ] **Step 5: Commit the auth state boundary**

```bash
git add store/authSlice.ts store/authSlice.test.ts lib/auth-api.ts package.json
git commit -m "feat: add Redux authentication slice"
```

### Task 2: Persist Only Auth Session Fields

**Files:**
- Create: `store/authPersist.ts`
- Create: `store/authPersist.test.ts`
- Modify: `store/store.ts`
- Modify: `store/hooks.ts`

**Interfaces:**
- Consumes: the auth reducer and `AuthState` from Task 1.
- Produces: `serializeAuthState`, `rehydrateAuthState`, `authPersistConfig`, `persistedAuthReducer`, `makeStore()`, `AppStore`, `RootState`, and `AppDispatch`.

- [ ] **Step 1: Write a failing persistence transform test**

Exercise the exported `serializeAuthState` boundary with a complete auth state and assert that its persisted form is exactly:

```ts
{
  user: session.user,
  accessToken: 'access-1',
  refreshToken: 'refresh-1',
}
```

Assert that `loading`, `initialized`, and `error` are absent. Also assert that
`rehydrateAuthState` supplies `loading: false`, `initialized: false`, and
`error: null`.

- [ ] **Step 2: Run the persistence test and verify RED**

Run: `npx tsx --test store/authPersist.test.ts`

Expected: FAIL because `store/authPersist.ts` does not exist.

- [ ] **Step 3: Implement nested auth persistence and store factory**

Create a Redux Persist transform for `AuthState` that serializes only the three approved session fields and restores transient fields as `loading: false`, `initialized: false`, and `error: null`. Configure the persisted auth reducer with key `auth` and local storage. Configure the root store with `auth` and `validation` reducers and Redux Persist's serializable-action exceptions:

```ts
ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
```

Export a `makeStore()` factory and types derived from its return value. Keep validation outside every persistence whitelist.

- [ ] **Step 4: Run focused tests and strict type checking**

Run: `npx tsx --test store/authPersist.test.ts store/authSlice.test.ts`

Run: `npm run typecheck`

Expected: both commands PASS.

- [ ] **Step 5: Commit persistence configuration**

```bash
git add store/authPersist.ts store/authPersist.test.ts store/store.ts store/hooks.ts
git commit -m "feat: persist Redux auth sessions"
```

### Task 3: Client Provider and Startup Restoration

**Files:**
- Modify: `components/StoreProvider.tsx`
- Modify: `app/layout.tsx`
- Delete: `context/PermissionContext.tsx`

**Interfaces:**
- Consumes: `makeStore()`, `restoreSessionThunk`, and Redux Persist's `persistStore`/`PersistGate`.
- Produces: a single client provider that rehydrates Redux and validates a persisted session once.

- [ ] **Step 1: Add a failing test for restoration input selection**

In `store/authSlice.test.ts`, add a test for a pure exported `selectRestorableTokens(state: AuthState): AuthTokens | null`. It must return both tokens only when both are non-empty and otherwise return `null`.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npx tsx --test store/authSlice.test.ts`

Expected: FAIL because `selectRestorableTokens` is not exported.

- [ ] **Step 3: Implement the provider lifecycle**

Create one store per browser application instance with `useRef`, create its
persistor once, and wrap children with `Provider` and `PersistGate`. Render a
small `AuthBootstrap` child inside `Provider`; its guarded effect runs after
rehydration, removes legacy local-storage keys `mm_access_token`,
`mm_refresh_token`, and `mm_token`, reads the current auth state with
`selectRestorableTokens`, and dispatches `restoreSessionThunk` exactly once
when tokens exist or `markInitialized` otherwise.

Remove `PermissionProvider` from `app/layout.tsx` and delete its implementation after the Redux compatibility hook in Task 4 is ready in the same working batch.

- [ ] **Step 4: Run strict type checking**

Run: `npm run typecheck`

Expected: it may report `usePermission` integration errors until Task 4; no provider/store type errors may remain.

- [ ] **Step 5: Defer commit until Task 4**

The provider and compatibility hook form one deployable unit, so commit them together after Task 4 passes.

### Task 4: Redux-Backed Permission Compatibility Hook

**Files:**
- Modify: `hooks/usePermission.ts`
- Modify: `types/rbac.ts`
- Delete: `context/PermissionContext.tsx`

**Interfaces:**
- Consumes: typed Redux hooks, auth selectors/actions/thunks, `getDefaultDashboard`, and existing RBAC types.
- Produces: the unchanged `usePermission(): PermissionContextValue` UI contract.

- [ ] **Step 1: Write failing pure permission helper tests**

Create `lib/permission-helpers.test.ts` and assert role/permission behavior for Super Admin, Admin, User, Sub User, and Guest. The production change caught is an incorrect rank or Super Admin bypass.

- [ ] **Step 2: Run the helper tests and verify RED**

Run: `npx tsx --test lib/permission-helpers.test.ts`

Expected: FAIL because `lib/permission-helpers.ts` does not exist.

- [ ] **Step 3: Implement helpers and compatibility hook**

Create `lib/permission-helpers.ts` with pure `hasPermissionForUser`, `canUserCreateRole`, and `getCreatableRoles`. Rewrite `usePermission()` to select auth state and dispatch Redux operations. Its `login` awaits `loginThunk(...).unwrap()` and returns the existing role destination; rejection returns `{ success: false, error }`. Its `logout` dispatches `logoutThunk(selectRestorableTokens(auth)).unwrap()`. `updateUser` dispatches the slice action. Preserve `availablePermissions` as a module-level constant.

- [ ] **Step 4: Verify the complete compatibility layer**

Run: `npm test`

Run: `npm run typecheck`

Expected: all tests and strict TypeScript PASS with no remaining imports of `PermissionContext`.

- [ ] **Step 5: Commit provider and compatibility migration**

```bash
git add app/layout.tsx components/StoreProvider.tsx hooks/usePermission.ts types/rbac.ts lib/permission-helpers.ts lib/permission-helpers.test.ts store/authSlice.ts context/PermissionContext.tsx
git commit -m "refactor: move authentication context to Redux"
```

### Task 5: Full Verification and Main-Branch Delivery

**Files:**
- Verify all changed frontend files.

**Interfaces:**
- Consumes: the completed Redux authentication architecture.
- Produces: a verified, clean frontend `main` branch.

- [ ] **Step 1: Run all automated tests**

Run: `npm test`

Expected: zero failures.

- [ ] **Step 2: Run strict TypeScript checking**

Run: `npm run typecheck`

Expected: exit code 0.

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: Next.js compiles and generates all routes successfully.

- [ ] **Step 4: Inspect scope and working tree integrity**

Run: `git diff --check`

Run: `git status -sb`

Expected: no whitespace errors and only intended changes or a clean tree.

- [ ] **Step 5: Push the approved direct-main work**

Run: `git push origin main`

Expected: local `main` and `origin/main` point to the same commit.

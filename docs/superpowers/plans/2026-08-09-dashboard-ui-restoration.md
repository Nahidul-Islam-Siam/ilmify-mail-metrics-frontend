# Dashboard UI Restoration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the first commit's dashboard visuals on `/dashboard` and `/super-admin` while preserving the current TypeScript, Redux, API, middleware, and route architecture.

**Architecture:** Adapt the original stylesheet and shell presentation into the current typed layout components. A shared `DashboardOverview` owns the unchanged overview UI, while role-specific layouts supply navigation data to one visually consistent sidebar.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5, Redux Toolkit, Node test runner

## Global Constraints

- Use commit `a41bb0f` as the visual reference only.
- Do not restore obsolete JavaScript files, demo authentication, or the demo role switcher.
- Preserve current route groups, Redux auth state, API services, middleware, real user identity, and logout behavior.
- Both dashboard entry points must share the same visual system and overview component.

---

### Task 1: Restore the typed dashboard shell visuals

**Files:**
- Create: `styles/dashboard.css`
- Modify: `app/(dashboard)/layout.tsx`
- Modify: `components/dashboard/Sidebar.tsx`
- Modify: `components/super-admin/SuperAdminSidebar.tsx`
- Modify: `components/dashboard/Topbar.tsx`
- Modify: `components/layouts/DashboardLayout.tsx`
- Modify: `components/layouts/SuperAdminLayout.tsx`
- Test: `components/dashboard/dashboardVisualContract.test.ts`

**Interfaces:**
- Consumes: `USER_NAVIGATION`, `SUPER_ADMIN_NAVIGATION`, and `usePermission()`.
- Produces: the original `.dashboard-root`, `.app`, `.sidebar`, `.nav-item`, `.topbar`, and responsive visual contract for both typed layouts.

- [ ] **Step 1: Write the failing visual-contract test**

Create a Node test which reads both layout sources and `styles/dashboard.css`, then asserts that both layouts use `dashboard-root`, both use the shared original-style shell classes, and the stylesheet contains the original `--sbw:264px`, `.logo-mark`, `.nav-item`, `.topbar`, and mobile sidebar rules.

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm.cmd test -- components/dashboard/dashboardVisualContract.test.ts`

Expected: FAIL because the shared stylesheet and required shell classes do not exist.

- [ ] **Step 3: Restore the original stylesheet as scoped current CSS**

Copy the visual rules from `git show a41bb0f:app/dashboard/dashboard.css` into `styles/dashboard.css`. Scope dashboard rules under `.dashboard-root`, retain original breakpoints, and avoid global selectors that affect auth or marketing pages. Import it once from `app/(dashboard)/layout.tsx`.

- [ ] **Step 4: Adapt the original sidebar and top bar visuals to TypeScript**

Rebuild the current sidebar markup with the first commit's brand block, icon treatment, grouped navigation, active states, footer profile, and mobile classes. Keep navigation arrays as the source of allowed links. Keep `usePermission()` identity and logout in `Topbar`; omit `switchRoleDemo` and the role-testing pill.

- [ ] **Step 5: Make both role layouts use the restored shell contract**

Ensure `DashboardLayout` and `SuperAdminLayout` render the same `.dashboard-root > .app > sidebar + main-column` structure, with their existing role-specific sidebar inputs and `AuthenticatedRoute` protection.

- [ ] **Step 6: Run the focused test and TypeScript check**

Run: `npm.cmd test -- components/dashboard/dashboardVisualContract.test.ts`

Expected: PASS.

Run: `npm.cmd run typecheck`

Expected: exit code 0.

- [ ] **Step 7: Commit**

```powershell
git add styles/dashboard.css "app/(dashboard)/layout.tsx" components/dashboard/Sidebar.tsx components/super-admin/SuperAdminSidebar.tsx components/dashboard/Topbar.tsx components/layouts/DashboardLayout.tsx components/layouts/SuperAdminLayout.tsx components/dashboard/dashboardVisualContract.test.ts
git commit -m "feat: restore original dashboard shell UI"
```

### Task 2: Share the original overview UI across dashboard roles

**Files:**
- Create: `features/dashboard/DashboardOverview.tsx`
- Modify: `app/(dashboard)/dashboard/page.tsx`
- Modify: `app/(dashboard)/super-admin/page.tsx`
- Test: `features/dashboard/dashboardOverview.test.ts`

**Interfaces:**
- Produces: `DashboardOverview(): JSX.Element`, containing the first commit's metric cards, charts, controls, and validation activity table.
- Consumed by: `/dashboard` and `/super-admin` page modules.

- [ ] **Step 1: Write the failing shared-overview test**

Create a Node source-contract test that asserts both page modules import and render `DashboardOverview`, and that the shared component contains the reference headings `Email Validation Overview`, `Validations Stream`, `API Traffic`, `Disposable Protection`, and `Recent Validation Activity`.

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm.cmd test -- features/dashboard/dashboardOverview.test.ts`

Expected: FAIL because `DashboardOverview.tsx` does not exist and `/super-admin` still renders the simplified link-card page.

- [ ] **Step 3: Extract the preserved overview without redesigning it**

Move the current dashboard page presentation—already identical to the first commit's overview—into `features/dashboard/DashboardOverview.tsx`. Preserve its content and interaction state. Make both page modules thin wrappers that return `<DashboardOverview />`.

- [ ] **Step 4: Run focused and full verification**

Run: `npm.cmd test -- features/dashboard/dashboardOverview.test.ts`

Expected: PASS.

Run: `npm.cmd test`

Expected: all tests pass with zero failures.

Run: `npm.cmd run typecheck`

Expected: exit code 0.

- [ ] **Step 5: Commit**

```powershell
git add features/dashboard/DashboardOverview.tsx features/dashboard/dashboardOverview.test.ts "app/(dashboard)/dashboard/page.tsx" "app/(dashboard)/super-admin/page.tsx"
git commit -m "feat: share original dashboard overview UI"
```

### Task 3: Verify routes and publish

**Files:**
- Verify only; no planned source changes.

**Interfaces:**
- Consumes: completed Tasks 1 and 2.
- Produces: verified dashboard UI on both protected routes.

- [ ] **Step 1: Run the production build**

Run: `npm.cmd run build`

Expected: exit code 0 with `/dashboard`, `/super-admin`, and middleware listed in the route output.

- [ ] **Step 2: Verify clean version-control state and commits**

Run: `git diff --check`

Expected: no output and exit code 0.

Run: `git status --short --branch`

Expected: no uncommitted files and `main` ahead only by the intentional commits.

- [ ] **Step 3: Push directly to main**

Run: `git push origin main`

Expected: `main -> main` succeeds.

# Dashboard Shell Layout Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a stable responsive dashboard shell whose sidebar and topbar remain visible, whose content scrolls without overlap, and whose focused components remain small and maintainable.

**Architecture:** `DashboardLayout` remains a thin composition boundary. A dedicated mobile-menu hook owns behavior, layout/sidebar/topbar CSS modules own presentation, and the existing `DashboardOverview` keeps all real-data behavior while receiving only a responsive grid correction.

**Tech Stack:** Next.js 14, React 18, TypeScript 5.9, CSS Modules, Node test runner through `tsx`.

## Global Constraints

- Do not change backend contracts, API calls, authentication rules, navigation permissions, or dashboard data semantics.
- Preserve unrelated working-tree changes in validation, settings, marketing, and valid-contact files.
- Keep route pages thin and give every new component or hook one clear responsibility with a typed public interface.
- Do not introduce a new dependency or a new all-in-one dashboard component.
- Use CSS modules instead of adding more shell-related inline style objects.
- Keep desktop sidebar width at 264 pixels.
- Use `100dvh` for the shell, loopback-free browser behavior, accessible mobile controls, and reduced-motion support.

---

## File Structure

- Create `components/layouts/DashboardLayout.module.css`: viewport shell, main column, scroll region, mobile overlay, and responsive shell rules.
- Create `components/layouts/useDashboardMobileMenu.ts`: open/close/toggle state, route-change close, Escape close, and body scroll locking.
- Modify `components/layouts/DashboardLayout.tsx`: thin composition of sidebar, topbar, overlay, and scrollable content.
- Create `components/dashboard/Sidebar.module.css`: sidebar structure, navigation, active state, identity, and drawer transition.
- Modify `components/dashboard/Sidebar.tsx`: semantic typed sidebar markup with CSS-module classes.
- Create `components/dashboard/Topbar.module.css`: topbar, search, account controls, and responsive visibility rules.
- Modify `components/dashboard/Topbar.tsx`: typed accessible menu trigger and focused topbar markup.
- Modify `features/dashboard/DashboardOverview.module.css`: content-width-driven metric-card wrapping and overflow protection.
- Create `components/layouts/dashboardShellUi.test.ts`: source-contract tests for shell composition, component boundaries, accessibility, and responsive styles.

### Task 1: Viewport Shell and Mobile Navigation Behavior

**Files:**
- Create: `components/layouts/dashboardShellUi.test.ts`
- Create: `components/layouts/useDashboardMobileMenu.ts`
- Create: `components/layouts/DashboardLayout.module.css`
- Modify: `components/layouts/DashboardLayout.tsx`

**Interfaces:**
- Produces: `useDashboardMobileMenu(): { isOpen: boolean; open(): void; close(): void; toggle(): void }`.
- Consumes: existing `Sidebar`, `Topbar`, `AuthenticatedRoute`, and `ChildrenProps`.
- Produces: `DashboardLayout` shell classes consumed visually by all dashboard routes.

- [x] **Step 1: Write the failing shell contract tests**

Create a Node source-contract test that reads the layout, hook, and CSS module. Assert that:

```ts
assert.match(layout, /styles\.shell/);
assert.match(layout, /styles\.mainColumn/);
assert.match(layout, /styles\.content/);
assert.match(layout, /styles\.backdrop/);
assert.match(layout, /aria-label="Close navigation menu"/);
assert.match(hook, /event\.key === 'Escape'/);
assert.match(hook, /document\.body\.style\.overflow = 'hidden'/);
assert.match(css, /height:\s*100dvh/);
assert.match(css, /overflow:\s*hidden/);
assert.match(css, /overflow-y:\s*auto/);
```

- [x] **Step 2: Run the focused test and verify red**

Run:

```bash
npm test -- components/layouts/dashboardShellUi.test.ts
```

Expected: FAIL because the hook/CSS module do not exist and the layout has no named shell classes.

- [x] **Step 3: Implement the mobile-menu hook**

Implement a focused client hook using `usePathname`, `useCallback`, `useEffect`, and `useState`:

```ts
export interface DashboardMobileMenu {
  isOpen: boolean;
  open(): void;
  close(): void;
  toggle(): void;
}

export function useDashboardMobileMenu(): DashboardMobileMenu {
  // Close after pathname changes.
  // While open, lock document.body overflow and close on Escape.
  // Restore the previous overflow value during cleanup.
}
```

- [x] **Step 4: Implement the viewport shell**

Replace layout inline objects with CSS-module classes. The component shape remains small:

```tsx
const menu = useDashboardMobileMenu();

return (
  <AuthenticatedRoute>
    <div className={styles.shell}>
      <div className={`${styles.sidebarSlot} ${menu.isOpen ? styles.sidebarSlotOpen : ''}`}>
        <Sidebar isOpen={menu.isOpen} />
      </div>
      <button
        aria-label="Close navigation menu"
        className={`${styles.backdrop} ${menu.isOpen ? styles.backdropOpen : ''}`}
        onClick={menu.close}
        type="button"
      />
      <div className={styles.mainColumn}>
        <Topbar onMenuClick={menu.toggle} />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  </AuthenticatedRoute>
);
```

Use grid/flex rules so `.shell` is `height: 100dvh; overflow: hidden`, `.mainColumn` cannot overflow horizontally, and `.content` is the sole `overflow-y: auto` page region.

- [x] **Step 5: Run the focused test and TypeScript check**

Run:

```bash
npm test -- components/layouts/dashboardShellUi.test.ts
npm run typecheck
```

Expected: focused test PASS and TypeScript exits 0.

- [x] **Step 6: Commit Task 1 only**

```bash
git add components/layouts/DashboardLayout.tsx \
  components/layouts/DashboardLayout.module.css \
  components/layouts/useDashboardMobileMenu.ts \
  components/layouts/dashboardShellUi.test.ts
git commit -m "fix: stabilize dashboard shell scrolling"
```

### Task 2: Focused Responsive Sidebar

**Files:**
- Create: `components/dashboard/Sidebar.module.css`
- Modify: `components/dashboard/Sidebar.tsx`
- Modify: `components/layouts/dashboardShellUi.test.ts`

**Interfaces:**
- Consumes: `{ isOpen: boolean }`, `USER_NAVIGATION`, `usePermission()`, and `usePathname()`.
- Produces: `<aside id="dashboard-navigation" data-open={isOpen}>` for the topbar control relationship and mobile drawer styling.

- [x] **Step 1: Extend the failing test for sidebar semantics**

Assert the component uses its own CSS module, removes the root inline style, exposes `id="dashboard-navigation"`, supplies `aria-label="Primary navigation"`, and exposes the open state through `data-open` without duplicating the shell transform.

- [x] **Step 2: Run the focused test and verify red**

Run `npm test -- components/layouts/dashboardShellUi.test.ts`.

Expected: FAIL on missing sidebar module/semantic contract.

- [x] **Step 3: Implement the focused sidebar**

Use named elements and styles:

```tsx
<aside
  aria-label="Primary navigation"
  className={styles.sidebar}
  data-open={isOpen}
  id="dashboard-navigation"
>
  <Link className={styles.brand} href="/dashboard">MailMetric</Link>
  <p className={styles.sectionLabel}>User workspace</p>
  <nav className={styles.navigation}>...</nav>
  <div className={styles.identity}>...</div>
</aside>
```

The nav section scrolls independently if necessary; the identity remains at the bottom. At `max-width: 900px`, the sidebar fills the responsive slot created in Task 1. The shell wrapper remains the single owner of off-canvas transform behavior, while the sidebar exposes its explicit open state without duplicating that layout logic.

- [x] **Step 4: Verify the focused test and TypeScript**

Run:

```bash
npm test -- components/layouts/dashboardShellUi.test.ts
npm run typecheck
```

- [x] **Step 5: Commit Task 2 only**

```bash
git add components/dashboard/Sidebar.tsx \
  components/dashboard/Sidebar.module.css \
  components/layouts/dashboardShellUi.test.ts
git commit -m "refactor: isolate responsive dashboard sidebar"
```

### Task 3: Accessible Responsive Topbar

**Files:**
- Create: `components/dashboard/Topbar.module.css`
- Modify: `components/dashboard/Topbar.tsx`
- Modify: `components/layouts/DashboardLayout.tsx`
- Modify: `components/layouts/SuperAdminLayout.tsx`
- Modify: `components/layouts/dashboardShellUi.test.ts`

**Interfaces:**
- Consumes: `{ menuOpen: boolean; onMenuClick(): void }` and existing permission/logout behavior.
- Produces: a menu button controlling `dashboard-navigation` with correct expanded state.

- [x] **Step 1: Extend the failing topbar tests**

Assert the topbar has its own CSS module and the menu trigger contains:

```tsx
aria-controls="dashboard-navigation"
aria-expanded={menuOpen}
aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
type="button"
```

Also assert the large root inline style objects are removed.

- [x] **Step 2: Run the focused test and verify red**

Run `npm test -- components/layouts/dashboardShellUi.test.ts`.

- [x] **Step 3: Refactor topbar presentation into its CSS module**

Keep logout, role badge selection, search markup, and account identity behavior unchanged. Use classes for layout, search, credits, logout, avatar, identity, and breakpoint visibility. Hide low-priority credits/profile text before allowing horizontal overflow.

Pass `menuOpen={menu.isOpen}` from `DashboardLayout` so the trigger communicates its current state without moving mobile-menu ownership into the topbar.
Keep `onMenuClick` optional and pass `menuOpen={false}` from the existing Super Admin shell so it does not render a non-functional mobile trigger.

- [x] **Step 4: Verify focused tests and TypeScript**

Run:

```bash
npm test -- components/layouts/dashboardShellUi.test.ts
npm run typecheck
```

- [x] **Step 5: Commit Task 3 only**

```bash
git add components/dashboard/Topbar.tsx \
  components/dashboard/Topbar.module.css \
  components/layouts/DashboardLayout.tsx \
  components/layouts/SuperAdminLayout.tsx \
  components/layouts/dashboardShellUi.test.ts
git commit -m "refactor: isolate responsive dashboard topbar"
```

### Task 4: Content-Width Responsive Dashboard Overview

**Files:**
- Modify: `features/dashboard/DashboardOverview.module.css`
- Modify: `features/dashboard/dashboardOverviewUi.test.ts`

**Interfaces:**
- Consumes: existing `DashboardOverview` markup and data.
- Produces: metric and skeleton grids that wrap without horizontal page overflow.

- [ ] **Step 1: Add a failing responsive-grid contract**

Read the CSS module and assert `.metricGrid` and `.skeletonGrid` use the same `repeat(auto-fit, minmax(...))` sizing or equivalent container-safe rules, plus `min-width: 0` on page/panel boundaries.

- [ ] **Step 2: Run the focused overview test and verify red**

Run `npm test -- features/dashboard/dashboardOverviewUi.test.ts`.

- [ ] **Step 3: Implement minimal responsive grid changes**

Use one shared declaration such as:

```css
.metricGrid,
.skeletonGrid {
  grid-template-columns: repeat(auto-fit, minmax(min(190px, 100%), 1fr));
}
```

Retain the existing one-column mobile layout and do not change dashboard labels, metrics, or API state.

- [ ] **Step 4: Run dashboard tests and TypeScript**

Run:

```bash
npm test -- features/dashboard/dashboardOverview.test.ts \
  features/dashboard/dashboardOverviewUi.test.ts \
  components/layouts/dashboardShellUi.test.ts
npm run typecheck
```

- [ ] **Step 5: Commit Task 4 only**

```bash
git add features/dashboard/DashboardOverview.module.css \
  features/dashboard/dashboardOverviewUi.test.ts
git commit -m "fix: wrap dashboard metrics within content width"
```

### Task 5: Full Frontend Verification and Manual Layout Check

**Files:**
- Verify only; modify only a directly failing dashboard-shell file if evidence requires it.

**Interfaces:**
- Consumes: completed Tasks 1-4.
- Produces: fresh evidence for tests, types, build, and manual responsive behavior.

- [ ] **Step 1: Run the complete test suite**

Run `npm test`.

Expected: all test suites and tests pass with zero failures.

- [ ] **Step 2: Run TypeScript checking**

Run `npm run typecheck`.

Expected: exit 0 with no diagnostics.

- [ ] **Step 3: Run the production build separately**

Stop any process sharing `.next`, then run `npm run build`.

Expected: Next.js production compilation and route generation complete successfully.

- [ ] **Step 4: Audit Git scope**

Run:

```bash
git status --short
git diff --check
git log --oneline -6
```

Confirm unrelated pre-existing files were not staged or changed by this work.

- [ ] **Step 5: Manually verify layout behavior**

At wide desktop, smaller desktop/tablet, and mobile widths, confirm:

- sidebar/topbar remain visible while main content scrolls;
- the heading begins below the topbar and is never covered;
- metric cards do not create horizontal page overflow;
- hamburger, backdrop, navigation, and Escape close the mobile drawer;
- profile/search controls shrink without collision;
- recent contacts remain usable.

- [ ] **Step 6: Commit only evidence-driven corrections**

If verification required no correction, do not create an empty commit. Otherwise stage only the relevant dashboard-shell files and commit with a narrow `fix:` message.

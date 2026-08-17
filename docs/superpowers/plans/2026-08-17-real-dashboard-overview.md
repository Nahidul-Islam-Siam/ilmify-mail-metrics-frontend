# Real Dashboard Overview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `/dashboard` demo with an authenticated, database-backed overview using the existing valid-contact summary and list endpoints.

**Architecture:** A pure dashboard feature module defines formatting, percentages, and one parallel data loader over the existing valid-contacts API service. A focused client component owns request lifecycle and presentation, while the route remains a thin wrapper and a CSS module contains responsive styling.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5, Redux Toolkit, Node test runner, existing `validContactsApi` service

## Global Constraints

- Use only `GET /valid-contacts/summary` and `GET /valid-contacts?sort=newest&page=1&limit=6`; do not add or change backend contracts.
- Never fabricate totals, trends, dates, percentages, API traffic, or activity.
- `suppressed` may overlap deliverability and must not be added to a total.
- Scores are points out of 100, not percentages.
- Preserve authentication, shared dashboard layout, navigation, and all unrelated working-tree changes.
- Do not modify `services/api/validContactsApi.ts` or existing dirty valid-contact/validation files.
- Execute inline in the current session; do not dispatch subagents.
- Render the authenticated user, the six newest contacts, Deliverable versus Risky, and Previously contacted versus Never sent exactly as defined in the approved design.

---

### Task 1: Add the tested dashboard data model

**Files:**
- Create: `features/dashboard/dashboardOverview.ts`
- Test: `features/dashboard/dashboardOverview.test.ts`

**Interfaces:**
- Consumes: `ValidContactsPage`, `ValidContactsSummary`, `DEFAULT_FILTERS`, `listValidContacts()`, and `getValidContactsSummary()`.
- Produces:
  - `loadDashboardOverview(accessToken: string, signal?: AbortSignal, source?: DashboardDataSource): Promise<DashboardOverviewData>`
  - `getDashboardFirstName(name?: string | null): string | null`
  - `getDashboardPercent(part: number, total: number): number | null`
  - `formatDashboardDate(value: string): string`

- [ ] **Step 1: Write failing unit tests for real-value derivation**

Create `features/dashboard/dashboardOverview.test.ts` with fixtures for one contact page and summary. Assert:

```ts
assert.equal(getDashboardFirstName('MailMetric Admin'), 'MailMetric');
assert.equal(getDashboardFirstName('   '), null);
assert.equal(getDashboardPercent(3, 6), 50);
assert.equal(getDashboardPercent(0, 0), null);
assert.equal(formatDashboardDate('2026-08-17T06:00:00.000Z'), '17 Aug 2026');
```

Also inject a `DashboardDataSource` whose two methods record their arguments. Assert that `loadDashboardOverview('token', signal, source)` requests page `1`, limit `6`, `sort: 'newest'`, forwards the same signal and token to both calls, and returns the exact page and summary without recomputing totals.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- features/dashboard/dashboardOverview.test.ts
```

Expected: FAIL because `dashboardOverview.ts` does not exist.

- [ ] **Step 3: Implement the minimal pure model and loader**

Create `features/dashboard/dashboardOverview.ts` with these boundaries:

```ts
export interface DashboardOverviewData {
  contactsPage: ValidContactsPage;
  summary: ValidContactsSummary;
}

export interface DashboardDataSource {
  list(
    filters: ContactFilters,
    page: number,
    limit: number,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<ValidContactsPage>;
  summary(
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<ValidContactsSummary>;
}
```

Use a default source that delegates to `listValidContacts` and `getValidContactsSummary`, and load them using `Promise.all`. Pass `{ ...DEFAULT_FILTERS, sort: 'newest' }`, page `1`, and limit `6`.

Implement helpers with exact semantics:

```ts
export function getDashboardFirstName(name?: string | null): string | null {
  return name?.trim().split(/\s+/)[0] || null;
}

export function getDashboardPercent(part: number, total: number): number | null {
  return total > 0 ? Math.round((part / total) * 100) : null;
}

export function formatDashboardDate(value: string): string {
  return new Intl.DateTimeFormat('en', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(value));
}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
npm test -- features/dashboard/dashboardOverview.test.ts
```

Expected: all tests in the file pass.

- [ ] **Step 5: Commit the model**

```bash
git add features/dashboard/dashboardOverview.ts features/dashboard/dashboardOverview.test.ts
git commit -m "feat: add real dashboard data model"
```

---

### Task 2: Replace the demo with the real dashboard component

**Files:**
- Create: `features/dashboard/DashboardOverview.tsx`
- Create: `features/dashboard/DashboardOverview.module.css`
- Create: `features/dashboard/dashboardOverviewUi.test.ts`
- Modify: `app/(dashboard)/dashboard/page.tsx`

**Interfaces:**
- Consumes: `usePermission()`, Redux `clearSession`, `loadDashboardOverview()`, formatting helpers, and validation badge vocabulary.
- Produces: `DashboardOverview(): JSX.Element`, rendered only by `/dashboard/page.tsx`.

- [ ] **Step 1: Write the failing UI source-contract test**

Create `features/dashboard/dashboardOverviewUi.test.ts`. Read `DashboardOverview.tsx` and the route source with `readFileSync`, then assert:

```ts
assert.doesNotMatch(component, /250,000|234,567|125,460|sarah\.chen|Welcome back, John/);
assert.match(component, /loadDashboardOverview/);
assert.match(component, /Total saved contacts/);
assert.match(component, /Deliverable/);
assert.match(component, /Risky/);
assert.match(component, /Suppressed/);
assert.match(component, /Previously contacted/);
assert.match(component, /Recent contacts/);
assert.match(component, /role="alert"/);
assert.match(component, />Retry</);
assert.match(route, /<DashboardOverview\s*\/>/);
```

Also assert that the route no longer contains the known fake figures or sample addresses.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- features/dashboard/dashboardOverviewUi.test.ts
```

Expected: FAIL because the component does not exist and the route still contains demo data.

- [ ] **Step 3: Implement request lifecycle in `DashboardOverview.tsx`**

Create a client component with this state:

```ts
type DashboardState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: DashboardOverviewData };
```

Use `usePermission()` for `user` and `token`, `useAppDispatch()` for 401 session clearing, and a `reloadKey` counter for Retry. In an effect:

- if there is no token, set the error `Your session has expired. Please sign in again.`;
- create one `AbortController`;
- call `loadDashboardOverview(token, controller.signal)`;
- on `ValidContactsApiError` status `401`, dispatch `clearSession()`;
- otherwise show the API error message or `Unable to load dashboard data.`;
- ignore abort completion and abort on cleanup.

- [ ] **Step 4: Implement only real-data presentation**

Build the approved composition:

- greeting from `getDashboardFirstName(user?.name)` with neutral fallback;
- actions linking to `/dashboard/validation/single`, `/dashboard/validation/bulk`, and `/dashboard/valid-emails`;
- KPI cards using `contactsPage.total`, `summary.deliverable`, `summary.risky`, `summary.suppressed`, and `summary.sent`;
- deliverable/risky count bars using `getDashboardPercent(value, summary.deliverable + summary.risky)`;
- contacted and never-sent count rows using their raw values and independent percentages against `contactsPage.total`;
- up to six `contactsPage.contacts` rows with email, deliverability text, `Quality score {score}/100`, source, and `formatDashboardDate(lastValidatedAt)`;
- an empty recent-contact state linking to Single Validation;
- a loading skeleton and an inline `role="alert"` error with a `Retry` button.

Do not render fake growth badges, time-series axes, sample emails, API traffic, or placeholder business metrics.

- [ ] **Step 5: Add responsive, accessible CSS**

Create `DashboardOverview.module.css` with:

- a five-column KPI grid that collapses to three, two, and one columns;
- two-column distribution panels that collapse to one;
- status badges that include visible text;
- stable skeleton blocks;
- a horizontally safe recent-contact table on desktop and stacked contact cards below `720px`;
- existing dashboard color tokens where available and visible focus styles for links/buttons.

- [ ] **Step 6: Make the route a thin wrapper**

Replace the complete inline demo in `app/(dashboard)/dashboard/page.tsx` with:

```tsx
import DashboardOverview from '@/features/dashboard/DashboardOverview';

export default function DashboardPage() {
  return <DashboardOverview />;
}
```

- [ ] **Step 7: Run focused UI and model tests**

Run:

```bash
npm test -- features/dashboard/dashboardOverview.test.ts features/dashboard/dashboardOverviewUi.test.ts
```

Expected: both files pass with zero failures.

- [ ] **Step 8: Run TypeScript checking**

Run:

```bash
npm run typecheck
```

Expected: exit code `0`.

- [ ] **Step 9: Commit the real dashboard UI**

Stage only these files:

```bash
git add features/dashboard/DashboardOverview.tsx features/dashboard/DashboardOverview.module.css features/dashboard/dashboardOverviewUi.test.ts "app/(dashboard)/dashboard/page.tsx"
git commit -m "feat: show real dashboard overview"
```

---

### Task 3: Verify the frontend without disturbing unrelated changes

**Files:**
- Verify only.

**Interfaces:**
- Consumes: completed dashboard feature and current frontend repository.
- Produces: evidence for tests, type safety, build output, diff scope, and manual deployment testing.

- [ ] **Step 1: Run the complete frontend test suite**

Run:

```bash
npm test
```

Expected: zero failed tests.

- [ ] **Step 2: Run a production build without a concurrent dev server**

Confirm no `next dev` process is sharing `.next`, then run:

```bash
npm run build
```

Expected: exit code `0` and `/dashboard` present in the route output.

- [ ] **Step 3: Verify dashboard diff and preserve unrelated files**

Run:

```bash
git diff --check HEAD^..HEAD
git status --short --branch
```

Expected: dashboard commits contain only their named feature files; pre-existing unrelated modified files remain uncommitted and unchanged.

- [ ] **Step 4: Manual production verification after deployment**

Open `/dashboard` after authentication and confirm:

- Network requests target `https://api.mailifymetric.ecomgenilus.com/api/v1/valid-contacts/summary` and `/valid-contacts?sort=newest&page=1&limit=6`;
- displayed values match the two API responses;
- no demo names, emails, totals, growth values, or fake charts remain;
- loading, zero-data, error, and Retry presentation remain usable at desktop and mobile widths.

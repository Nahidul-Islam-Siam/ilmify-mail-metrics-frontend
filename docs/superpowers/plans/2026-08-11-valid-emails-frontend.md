# Valid Emails Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Build a responsive, interactive Valid Emails page with mock contact data, filtering, selection controls, and a plain-text email composer ready for later API integration.

**Architecture:** Keep domain behavior in a framework-independent feature module so Node tests can cover filters and selection without a browser test dependency. Render the workspace in one client component backed by a CSS module, while the route and dashboard navigation stay thin.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5.9, CSS Modules, Node test runner through `tsx`.

## Global Constraints

- Use mock data only in this slice; do not call unfinished backend endpoints.
- Default to valid contacts and 20 rows per page.
- The header checkbox selects only visible contacts; a separate action selects all filtered contacts.
- Clear selection whenever filters change.
- Disable sending for zero recipients, more than 25 recipients, blank subject, or blank message.
- Keep the composer plain text and show the shared Titan sender as read-only.
- Preserve all unrelated working-tree changes.

---

### Task 1: Contact filtering and selection model

**Files:**

- Create: `features/valid-contacts/validContacts.ts`
- Create: `features/valid-contacts/validContacts.test.ts`

**Interfaces:**

- Produces: `ValidatedContact`, `ContactFilters`, `ContactSelection`, `filterContacts`, `toggleContact`, `toggleVisibleContacts`, `selectAllMatching`, `clearSelection`, and `getSelectedCount`.

- [x] **Step 1: Write failing tests**

```ts
it('defaults the list to valid contacts', () => {
  assert.deepEqual(filterContacts(MOCK_CONTACTS, DEFAULT_FILTERS).map(({ id }) => id), ['contact-1']);
});

it('selects the visible page without selecting hidden matching contacts', () => {
  assert.deepEqual(toggleVisibleContacts(clearSelection(), ['1', '2'], true).ids, ['1', '2']);
});

it('tracks excluded rows when all matching contacts are selected', () => {
  const selection = toggleContact(selectAllMatching(8), '2');
  assert.equal(getSelectedCount(selection), 7);
});
```

- [x] **Step 2: Run tests and verify RED**

Run: `pnpm exec tsx --test features/valid-contacts/validContacts.test.ts`

Expected: FAIL because `validContacts.ts` does not exist.

- [x] **Step 3: Add the minimal domain implementation**

Implement literal unions for validation/source/activity/sort, deterministic filter and sort behavior, and explicit/all-matching selection modes. Preserve all-matching exclusions when a row is toggled.

- [x] **Step 4: Run tests and verify GREEN**

Run: `pnpm exec tsx --test features/valid-contacts/validContacts.test.ts`

Expected: all feature tests PASS.

### Task 2: Responsive workspace and composer

**Files:**

- Create: `features/valid-contacts/ValidContactsWorkspace.tsx`
- Create: `features/valid-contacts/ValidContactsWorkspace.module.css`
- Create: `app/(dashboard)/dashboard/valid-emails/page.tsx`

**Interfaces:**

- Consumes: Task 1 contact/filter/selection interfaces.
- Produces: the `/dashboard/valid-emails` page.

- [x] **Step 1: Compose the page from the tested behavior**

Render a page header, summary cards, compact filters, contact rows with status/source/score metadata, visible-page selection, all-matching selection banner, pagination controls, and a sticky composer.

- [x] **Step 2: Implement interaction states**

Reset selection on every filter change. Show selected and risky counts. Require recipients, subject, and message; enforce the 25-recipient cap; simulate a successful mock send without network access.

- [x] **Step 3: Add responsive and accessible styling**

Use the existing `#F8FAFC` canvas, white cards, `#EAECF0` borders, and `#7C3AED` accent. Collapse to one column below 1080px, preserve visible focus states, label every input, and expose live composer feedback.

- [x] **Step 4: Run static verification**

Run: `pnpm run typecheck`

Expected: PASS without TypeScript errors.

### Task 3: Dashboard navigation

**Files:**

- Modify: `lib/dashboard-navigation.test.ts`
- Modify: `lib/dashboard-navigation.ts`

**Interfaces:**

- Consumes: the Task 2 route.
- Produces: a `Valid Emails` dashboard sidebar link.

- [x] **Step 1: Update the navigation test first**

Assert that `/dashboard/valid-emails` appears after bulk validation in `USER_NAVIGATION`.

- [x] **Step 2: Run the test and verify RED**

Run: `pnpm exec tsx --test lib/dashboard-navigation.test.ts`

Expected: FAIL because the route is absent.

- [x] **Step 3: Add the navigation item**

Add `{ label: 'Valid Emails', href: '/dashboard/valid-emails' }` after Bulk validation.

- [x] **Step 4: Run the test and verify GREEN**

Run: `pnpm exec tsx --test lib/dashboard-navigation.test.ts`

Expected: PASS.

### Task 4: Complete verification

**Files:**

- Verify all files from Tasks 1-3.

**Interfaces:**

- Consumes: the complete frontend slice.
- Produces: verified design-only implementation ready for backend API wiring.

- [x] **Step 1: Run the complete frontend test suite**

Run: `pnpm test`

Expected: all tests PASS.

- [x] **Step 2: Run TypeScript verification**

Run: `pnpm run typecheck`

Expected: PASS.

- [x] **Step 3: Run the production build**

Run: `pnpm run build`

Expected: Next.js production build completes and includes `/dashboard/valid-emails`.

- [x] **Step 4: Review the final diff**

Confirm only the new feature files, the route, the navigation pair, and this plan contain intentional changes; keep unrelated CRLF-only modifications out of the feature commit.

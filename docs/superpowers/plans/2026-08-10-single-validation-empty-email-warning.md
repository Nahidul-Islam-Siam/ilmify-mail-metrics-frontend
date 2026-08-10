# Single Validation Empty Email Warning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Start the single-validation input empty and show an inline warning without making an API request when the submitted value is empty or whitespace-only.

**Architecture:** Add one pure input-warning helper beside the validation feature and consume it at the start of the existing submit handler. Reuse the page's current `error` alert and clear only the empty-input warning when the user types, preserving all non-empty authentication and validation behavior.

**Tech Stack:** Next.js 14, React 18, strict TypeScript, Node test runner through `tsx`.

## Global Constraints

- Warning copy is exactly `Please enter an email address.`
- Empty submission must not set loading, refresh authentication, or call the validation API.
- Non-empty submission behavior and existing styling must remain unchanged.
- Do not change the backend API or shared validation result contract.

---

### Task 1: Guard Empty Single-Validation Submissions

**Files:**
- Create: `features/validation/singleValidationInput.ts`
- Create: `features/validation/singleValidationInput.test.ts`
- Modify: `app/(dashboard)/dashboard/validation/single/page.tsx`

**Interfaces:**
- Produces: `EMPTY_EMAIL_WARNING: 'Please enter an email address.'`
- Produces: `getSingleValidationInputWarning(email: string): string | null`
- Consumes: the existing page `error`, `email`, `loading`, `result`, `validateSingleEmail()`, and `refreshAccessToken()` boundaries.

- [ ] **Step 1: Write the failing helper and page-contract tests**

Create `features/validation/singleValidationInput.test.ts` with tests that call the real helper and inspect the page contract:

```ts
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  EMPTY_EMAIL_WARNING,
  getSingleValidationInputWarning,
} from './singleValidationInput';

test('returns the empty-email warning only for blank input', () => {
  assert.equal(getSingleValidationInputWarning(''), EMPTY_EMAIL_WARNING);
  assert.equal(getSingleValidationInputWarning('   '), EMPTY_EMAIL_WARNING);
  assert.equal(getSingleValidationInputWarning('person@example.com'), null);
});

test('single validation page starts empty and guards before loading or API work', () => {
  const source = readFileSync(
    new URL('../../app/(dashboard)/dashboard/validation/single/page.tsx', import.meta.url),
    'utf8',
  );
  assert.match(source, /useState\(''\)/);
  assert.match(source, /getSingleValidationInputWarning\(email\)/);
  assert.match(source, /if \(inputWarning\)[\s\S]*setError\(inputWarning\)[\s\S]*return/);
  assert.match(source, /onChange=\{\(event\) => \{[\s\S]*setError\(null\)/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npx tsx --test features/validation/singleValidationInput.test.ts
```

Expected: FAIL because `singleValidationInput.ts` does not exist.

- [ ] **Step 3: Add the minimal pure warning helper**

Create `features/validation/singleValidationInput.ts`:

```ts
export const EMPTY_EMAIL_WARNING = 'Please enter an email address.';

export function getSingleValidationInputWarning(email: string): string | null {
  return email.trim() ? null : EMPTY_EMAIL_WARNING;
}
```

- [ ] **Step 4: Run the focused test and confirm only the page contract remains RED**

Run:

```bash
npx tsx --test features/validation/singleValidationInput.test.ts
```

Expected: helper assertions pass; page-contract assertions fail because the page still starts with `test@example.com` and has no early guard.

- [ ] **Step 5: Integrate the guard into the existing page**

Import the helper, initialize `email` with `''`, and place this guard immediately after `event.preventDefault()` and before `setLoading(true)`:

```ts
const inputWarning = getSingleValidationInputWarning(email);
if (inputWarning) {
  setError(inputWarning);
  setResult(null);
  return;
}
```

Change the input handler so typing updates the value and clears the warning:

```tsx
onChange={(event) => {
  setEmail(event.target.value);
  if (error === EMPTY_EMAIL_WARNING) setError(null);
}}
```

- [ ] **Step 6: Run focused and complete verification**

Run sequentially:

```bash
npx tsx --test features/validation/singleValidationInput.test.ts
npm test
npm run typecheck
npm run build
```

Expected: focused tests pass, all frontend tests pass, strict TypeScript reports zero errors, and the production build completes with `/dashboard/validation/single` generated.

- [ ] **Step 7: Commit when Git identity is configured**

```bash
git add features/validation/singleValidationInput.ts features/validation/singleValidationInput.test.ts "app/(dashboard)/dashboard/validation/single/page.tsx" docs/superpowers/specs/2026-08-10-single-validation-empty-email-warning-design.md docs/superpowers/plans/2026-08-10-single-validation-empty-email-warning.md
git commit -m "fix: warn when single validation email is empty"
```

If Git identity remains unavailable, leave only these files staged and report that the commit was blocked.

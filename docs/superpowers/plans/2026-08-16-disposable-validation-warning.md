# Disposable Validation Warning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a prominent disposable-email warning above the existing single-validation evidence.

**Architecture:** A pure presentation helper converts an `EmailValidationResult` into an optional warning. The single-validation page renders the warning as an accessible red banner while leaving the existing result UI unchanged.

**Tech Stack:** Next.js 14, React 18, TypeScript 5.9, Node test runner with `tsx`

## Global Constraints

- Do not change the API contract, validation types, backend, bulk page, or shared generic alert system.
- Preserve all pre-existing uncommitted frontend changes.
- Do not describe the mailbox as nonexistent; communicate only the disposable-domain policy classification.
- Keep score, badges, evidence, and check cards visible.

---

### Task 1: Disposable warning helper and banner

**Files:**
- Create: `features/validation/disposableValidationWarning.ts`
- Create: `features/validation/disposableValidationWarning.test.ts`
- Modify: `app/(dashboard)/dashboard/validation/single/page.tsx`

**Interfaces:**
- Consumes: `Pick<EmailValidationResult, 'emailType'>`.
- Produces: `getDisposableValidationWarning(result): DisposableValidationWarning | null`.
- Produces: a `role="alert"` banner before the normal single-validation result summary.

- [ ] **Step 1: Write the failing helper test**

```ts
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getDisposableValidationWarning } from './disposableValidationWarning';

test('returns the policy warning only for disposable email results', () => {
  assert.deepEqual(
    getDisposableValidationWarning({ emailType: 'disposable' }),
    {
      title: 'Disposable email detected',
      message:
        'This address uses a temporary email provider. We recommend not using it. Mailbox probing was skipped because the domain is classified as disposable.',
    },
  );
  assert.equal(
    getDisposableValidationWarning({ emailType: 'business' }),
    null,
  );
});
```

- [ ] **Step 2: Run the focused test and verify RED**

```bash
pnpm exec tsx --test features/validation/disposableValidationWarning.test.ts
```

Expected: FAIL because `disposableValidationWarning.ts` does not exist.

- [ ] **Step 3: Implement the pure helper**

```ts
import type { EmailValidationResult } from './types';

export interface DisposableValidationWarning {
  title: string;
  message: string;
}

export function getDisposableValidationWarning(
  result: Pick<EmailValidationResult, 'emailType'>,
): DisposableValidationWarning | null {
  if (result.emailType !== 'disposable') return null;
  return {
    title: 'Disposable email detected',
    message:
      'This address uses a temporary email provider. We recommend not using it. Mailbox probing was skipped because the domain is classified as disposable.',
  };
}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run the Step 2 command again.

Expected: 1 test passes.

- [ ] **Step 5: Write and run the failing page-source test**

Extend the new test before changing the page:

```ts
import { readFileSync } from 'node:fs';

test('single validation renders the disposable warning above its evidence', () => {
  const source = readFileSync(
    new URL(
      '../../app/(dashboard)/dashboard/validation/single/page.tsx',
      import.meta.url,
    ),
    'utf8',
  );
  assert.match(source, /role="alert"/);
  assert.match(source, /disposableWarning\.title/);
  assert.match(source, /disposableWarning\.message/);
});
```

Run the Step 2 command.

Expected: helper test passes and page-source test FAILS because the banner is not rendered.

- [ ] **Step 6: Render the warning above existing evidence**

Import the helper, derive `disposableWarning` from `result`, and render before the existing result summary:

```tsx
{disposableWarning && (
  <div role="alert" style={{ background: '#FEF3F2', border: '1px solid #FDA29B', borderRadius: 12, padding: 16, color: '#B42318' }}>
    <strong style={{ display: 'block', marginBottom: 4 }}>
      {disposableWarning.title}
    </strong>
    <span>{disposableWarning.message}</span>
  </div>
)}
```

- [ ] **Step 7: Run the focused test and verify GREEN**

Run the Step 2 command again.

Expected: both tests pass.

- [ ] **Step 8: Run complete verification**

```bash
pnpm test
pnpm run typecheck
```

Expected: all frontend tests pass and TypeScript exits with code 0.

- [ ] **Step 9: Commit only scoped files**

```bash
git add features/validation/disposableValidationWarning.ts features/validation/disposableValidationWarning.test.ts 'app/(dashboard)/dashboard/validation/single/page.tsx'
git commit -m "feat: highlight disposable validation results"
```

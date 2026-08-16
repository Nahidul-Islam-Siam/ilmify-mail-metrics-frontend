# Single Validation Retry Countdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show an accurate live countdown and disable single-email validation until a server-provided mailbox-probe rate limit expires.

**Architecture:** Put deadline calculation and display formatting in a small pure TypeScript module so timing behavior can be tested without adding a browser-test dependency. The single-validation page owns the active deadline, recomputes remaining time from the fixed deadline, cleans up its interval, and only activates this UI when a temporary mailbox result includes a positive `retryAfterMs`.

**Tech Stack:** Next.js 14 App Router, React 18 hooks, TypeScript 5.9, Node test runner through `tsx --test`.

## Global Constraints

- Show the countdown only for `mailbox.outcome === 'temporary'` with a finite positive `retryAfterMs`.
- Keep ordinary temporary SMTP responses without `retryAfterMs` on the existing `retry later` presentation.
- Display `Too many checks. Try again in MM:SS` in a `role="status"`, `aria-live="polite"` warning.
- Disable the submit button and label it `Retry in Ns` until zero.
- Do not automatically submit when the countdown reaches zero.
- Calculate remaining time from a fixed deadline so timer drift and background tabs do not extend the wait.
- Editing the email must not clear an active server-provided wait period.
- Clear interval resources when the deadline changes or the page unmounts.
- Preserve every pre-existing uncommitted frontend change. The target page and UI source test are already dirty; never stage those entire files without proving hunk isolation.

---

### Task 1: Pure retry-countdown calculations

**Files:**
- Create: `features/validation/retryCountdown.ts`
- Create: `features/validation/retryCountdown.test.ts`

**Interfaces:**
- Consumes: `MailboxProbeResult['outcome']` and `MailboxProbeResult['retryAfterMs']` from `features/validation/types.ts`.
- Produces: `getRetryDeadline(mailbox, nowMs)`, `getRemainingRetrySeconds(deadlineMs, nowMs)`, and `formatRetryCountdown(seconds)`.

- [ ] **Step 1: Write the failing calculation tests**

```ts
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  formatRetryCountdown,
  getRemainingRetrySeconds,
  getRetryDeadline,
} from './retryCountdown';

test('creates a deadline only for a temporary result with a positive finite wait', () => {
  assert.equal(
    getRetryDeadline({ outcome: 'temporary', retryAfterMs: 47_250 }, 1_000),
    48_250,
  );
  assert.equal(getRetryDeadline({ outcome: 'temporary' }, 1_000), null);
  assert.equal(
    getRetryDeadline({ outcome: 'accepted', retryAfterMs: 47_250 }, 1_000),
    null,
  );
  assert.equal(
    getRetryDeadline({ outcome: 'temporary', retryAfterMs: Number.NaN }, 1_000),
    null,
  );
  assert.equal(
    getRetryDeadline({ outcome: 'temporary', retryAfterMs: 0 }, 1_000),
    null,
  );
});

test('derives remaining whole seconds from the deadline without going negative', () => {
  assert.equal(getRemainingRetrySeconds(48_250, 1_000), 48);
  assert.equal(getRemainingRetrySeconds(48_250, 47_251), 1);
  assert.equal(getRemainingRetrySeconds(48_250, 48_250), 0);
  assert.equal(getRemainingRetrySeconds(null, 1_000), 0);
});

test('formats countdown seconds as minutes and seconds', () => {
  assert.equal(formatRetryCountdown(0), '00:00');
  assert.equal(formatRetryCountdown(7), '00:07');
  assert.equal(formatRetryCountdown(67), '01:07');
});
```

- [ ] **Step 2: Run the focused test and verify the red state**

Run:

```bash
cd frontend
pnpm exec tsx --test features/validation/retryCountdown.test.ts
```

Expected: FAIL because `./retryCountdown` does not exist.

- [ ] **Step 3: Add the minimal pure implementation**

```ts
import type { MailboxProbeResult } from './types';

type RetryMailbox = Pick<MailboxProbeResult, 'outcome' | 'retryAfterMs'>;

export function getRetryDeadline(
  mailbox: RetryMailbox,
  nowMs = Date.now(),
): number | null {
  const waitMs = mailbox.retryAfterMs;
  if (
    mailbox.outcome !== 'temporary' ||
    waitMs === undefined ||
    !Number.isFinite(waitMs) ||
    waitMs <= 0
  ) {
    return null;
  }
  return nowMs + waitMs;
}

export function getRemainingRetrySeconds(
  deadlineMs: number | null,
  nowMs = Date.now(),
): number {
  if (deadlineMs === null) return 0;
  return Math.max(0, Math.ceil((deadlineMs - nowMs) / 1_000));
}

export function formatRetryCountdown(seconds: number): string {
  const safeSeconds = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}
```

- [ ] **Step 4: Run the focused test and verify the green state**

Run:

```bash
cd frontend
pnpm exec tsx --test features/validation/retryCountdown.test.ts
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit only the new isolated files**

```bash
git -C frontend add -- features/validation/retryCountdown.ts features/validation/retryCountdown.test.ts
git -C frontend diff --cached --check
git -C frontend commit -m "feat: add validation retry countdown calculations"
```

Expected: the commit contains exactly the two new files.

---

### Task 2: Single-validation countdown UI

**Files:**
- Modify: `app/(dashboard)/dashboard/validation/single/page.tsx`
- Modify: `features/validation/validationResultUi.test.ts`

**Interfaces:**
- Consumes: `getRetryDeadline`, `getRemainingRetrySeconds`, and `formatRetryCountdown` from Task 1.
- Produces: an accessible countdown warning and a disabled/relabelled submit button while `retrySeconds > 0`.

- [ ] **Step 1: Extend the source-contract test before changing the page**

Append this test to `features/validation/validationResultUi.test.ts`:

```ts
test('single validation presents and cleans up a server-provided retry countdown', () => {
  assert.match(singleSource, /getRetryDeadline\(nextResult\.mailbox\)/);
  assert.match(singleSource, /getRemainingRetrySeconds\(retryDeadline\)/);
  assert.match(singleSource, /window\.setInterval/);
  assert.match(singleSource, /return \(\) => window\.clearInterval\(timer\)/);
  assert.match(singleSource, /role="status"/);
  assert.match(singleSource, /aria-live="polite"/);
  assert.match(singleSource, /Too many checks\. Try again in/);
  assert.match(singleSource, /Retry in \$\{retrySeconds\}s/);
  assert.match(singleSource, /disabled=\{loading \|\| retrySeconds > 0\}/);
});
```

- [ ] **Step 2: Run the focused UI contract test and verify the red state**

Run:

```bash
cd frontend
pnpm exec tsx --test features/validation/validationResultUi.test.ts
```

Expected: the new countdown test fails because the page has no countdown state or accessible warning.

- [ ] **Step 3: Add deadline state and result activation to the page**

Update React imports and add the helper imports:

```ts
import { useEffect, useState, type FormEvent } from 'react';
import {
  formatRetryCountdown,
  getRemainingRetrySeconds,
  getRetryDeadline,
} from '@/features/validation/retryCountdown';
```

Add component state and a single result-activation boundary:

```ts
const [retryDeadline, setRetryDeadline] = useState<number | null>(null);
const [retrySeconds, setRetrySeconds] = useState(0);

function applyValidationResult(nextResult: EmailValidationResult) {
  const deadline = getRetryDeadline(nextResult.mailbox);
  setResult(nextResult);
  setRetryDeadline(deadline);
  setRetrySeconds(getRemainingRetrySeconds(deadline));
}
```

Replace both successful `setResult(await validateSingleEmail(...))` calls with:

```ts
applyValidationResult(await validateSingleEmail(email, token));
```

and:

```ts
applyValidationResult(await validateSingleEmail(email, refreshedToken));
```

- [ ] **Step 4: Add a drift-resistant interval with cleanup**

Place this effect after `applyValidationResult`:

```ts
useEffect(() => {
  if (retryDeadline === null) {
    setRetrySeconds(0);
    return;
  }

  const updateRemaining = () => {
    const remaining = getRemainingRetrySeconds(retryDeadline);
    setRetrySeconds(remaining);
    if (remaining === 0) setRetryDeadline(null);
  };

  updateRemaining();
  const timer = window.setInterval(updateRemaining, 250);
  return () => window.clearInterval(timer);
}, [retryDeadline]);
```

- [ ] **Step 5: Render the warning and lock the button**

Set the button behavior to:

```tsx
<button
  type="submit"
  disabled={loading || retrySeconds > 0}
  style={{ padding: '12px 24px', border: 0, borderRadius: 10, background: '#7C3AED', color: '#fff', fontWeight: 700 }}
>
  {loading
    ? 'Validating…'
    : retrySeconds > 0
      ? `Retry in ${retrySeconds}s`
      : 'Validate email'}
</button>
```

Render this immediately below the form and before the existing error:

```tsx
{retrySeconds > 0 && (
  <p
    role="status"
    aria-live="polite"
    style={{ color: '#B54708', background: '#FFFAEB', padding: 14, borderRadius: 10 }}
  >
    Too many checks. Try again in {formatRetryCountdown(retrySeconds)}
  </p>
)}
```

- [ ] **Step 6: Run focused tests and TypeScript validation**

Run:

```bash
cd frontend
pnpm exec tsx --test features/validation/retryCountdown.test.ts features/validation/validationResultUi.test.ts
pnpm typecheck
```

Expected: all focused tests pass and TypeScript exits with code 0.

- [ ] **Step 7: Preserve the pre-existing dirty page changes**

Run:

```bash
git -C frontend diff -- app/'(dashboard)'/dashboard/validation/single/page.tsx features/validation/validationResultUi.test.ts
git -C frontend status --short
```

Expected: the diff includes both pre-existing work and countdown work. Do not run a whole-file `git add` for these two paths. Leave the overlapping UI changes uncommitted and report that state unless a hunk-only staging operation can be independently reviewed.

---

### Task 3: Full frontend regression verification

**Files:**
- Verify only; no additional file changes.

**Interfaces:**
- Consumes: completed countdown helper and UI integration from Tasks 1 and 2.
- Produces: current full-suite and typecheck evidence.

- [ ] **Step 1: Run the complete frontend test suite**

Run:

```bash
cd frontend
pnpm test
```

Expected: every frontend test passes, including the new countdown tests.

- [ ] **Step 2: Run the complete TypeScript check**

Run:

```bash
cd frontend
pnpm typecheck
```

Expected: exit code 0 with no TypeScript diagnostics.

- [ ] **Step 3: Inspect final scope**

Run:

```bash
git -C frontend status --short
git -C frontend diff --check
git -C frontend diff --stat
```

Expected: no whitespace errors; previously dirty files remain preserved; only the two new helper files may have been committed separately.

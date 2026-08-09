# Validation Export System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users filter completed bulk-validation results and download the selected records as safe CSV or styled Excel files.

**Architecture:** A focused `validationExport` module owns filtering, stable row mapping, spreadsheet-safety normalization, filenames, CSV serialization, and Excel workbook creation. The bulk page owns only the selected filter, displays the matching count, invokes the module, and preserves the existing validation API and visual structure.

**Tech Stack:** Next.js 14, React 18, TypeScript 5.9, Node test runner via `tsx --test`, `write-excel-file`, `read-excel-file`

## Global Constraints

- Preserve the existing dashboard visual language and bulk-validation API contract.
- Keep export generation client-side for the current 1,000-email MVP limit.
- Support `all`, `valid`, `invalid`, `risky`, and `unknown` result filters.
- Support CSV (`.csv`) and Excel (`.xlsx`) only; Google Sheets export is deferred.
- Use the existing `write-excel-file` and `read-excel-file` packages; add no spreadsheet dependency and no Redis.
- Export the 15 approved fields in the approved order.
- Prevent spreadsheet formula injection in both formats.

---

### Task 1: Result filtering, row mapping, filenames, and CSV serialization

**Files:**
- Create: `features/validation/validationExport.ts`
- Create: `features/validation/validationExport.test.ts`

**Interfaces:**
- Consumes: `EmailValidationResult` and `ValidationStatus` from `features/validation/types.ts`.
- Produces: `ExportFilter`, `ExportRow`, `EXPORT_HEADERS`, `filterValidationResults()`, `mapValidationResultToExportRow()`, `createExportFilename()`, and `createValidationCsv()`.

- [ ] **Step 1: Write failing tests for filtering and stable row mapping**

Create representative `valid`, `invalid`, `risky`, and `unknown` results using the complete `EmailValidationResult` shape. Assert that:

```ts
assert.equal(filterValidationResults(results, 'all').length, 4);
assert.deepEqual(filterValidationResults(results, 'valid').map(({ status }) => status), ['valid']);
assert.deepEqual(filterValidationResults(results, 'invalid').map(({ status }) => status), ['invalid']);
assert.deepEqual(filterValidationResults(results, 'risky').map(({ status }) => status), ['risky']);
assert.deepEqual(filterValidationResults(results, 'unknown').map(({ status }) => status), ['unknown']);

const row = mapValidationResultToExportRow(results[0]);
assert.deepEqual(Object.keys(row), EXPORT_HEADERS);
assert.equal(row.Reasons, 'ROLE_ACCOUNT, PUBLIC_EMAIL_RESTRICTED');
assert.equal(row['Public Provider'], 'fail');
```

- [ ] **Step 2: Run the focused test and confirm the missing-module failure**

Run: `npx.cmd tsx --test features/validation/validationExport.test.ts`

Expected: FAIL because `validationExport.ts` and its exports do not exist.

- [ ] **Step 3: Implement filter types and stable export mapping**

Define these exact interfaces:

```ts
export type ExportFilter = 'all' | ValidationStatus;

export interface ExportRow {
  Email: string;
  'Normalized Email': string;
  Status: ValidationStatus;
  Score: number;
  Reasons: string;
  Syntax: string;
  DNS: string;
  MX: string;
  Disposable: string;
  'Public Provider': string;
  Blacklist: string;
  'Role Account': string;
  SMTP: string;
  Ownership: string;
  'Checked At': string;
}
```

Export a typed `EXPORT_HEADERS` array in the same order. `filterValidationResults()` returns all rows for `all`, otherwise only exact status matches. `mapValidationResultToExportRow()` maps every check and joins reasons using `, `.

- [ ] **Step 4: Add failing tests for safe filenames and CSV output**

Use a fixed `new Date('2026-08-09T12:00:00.000Z')` and assert:

```ts
assert.equal(createExportFilename('valid', 'csv', date), 'mailmetric-valid-2026-08-09.csv');
assert.equal(createExportFilename('all', 'xlsx', date), 'mailmetric-all-2026-08-09.xlsx');
assert.ok(csv.startsWith('\uFEFFEmail,Normalized Email,Status'));
assert.match(csv, /"reason, with comma"/);
assert.match(csv, /'\+malicious@example\.com/);
```

Include cells beginning with each formula trigger: `=`, `+`, `-`, and `@`, plus a quoted value and a newline.

- [ ] **Step 5: Implement filename, spreadsheet safety, and RFC-style CSV escaping**

Add a private `safeSpreadsheetValue(value)` that prefixes formula-triggering strings with `'`. Add a private `csvCell(value)` that doubles quotes and wraps only values containing commas, quotes, CR, or LF. `createValidationCsv(results)` maps rows in `EXPORT_HEADERS` order, joins lines with `\r\n`, and prefixes the document with UTF-8 BOM.

- [ ] **Step 6: Run the focused tests**

Run: `npx.cmd tsx --test features/validation/validationExport.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit the core export contract**

```bash
git add features/validation/validationExport.ts features/validation/validationExport.test.ts
git commit -m "feat: add validation export utilities"
```

---

### Task 2: Excel workbook generation

**Files:**
- Modify: `features/validation/validationExport.ts`
- Modify: `features/validation/validationExport.test.ts`

**Interfaces:**
- Consumes: `ExportRow`, `EXPORT_HEADERS`, and spreadsheet-safe values from Task 1.
- Produces: `createValidationWorkbook(results: EmailValidationResult[]): Promise<ArrayBuffer>`.

- [ ] **Step 1: Write a failing workbook test**

Call `createValidationWorkbook(results)`, read its returned `ArrayBuffer` with `readXlsxFile`, and assert:

```ts
assert.equal(sheets[0]?.sheet, 'Validation Results');
assert.deepEqual(sheets[0]?.data[0], EXPORT_HEADERS);
assert.equal(sheets[0]?.data.length, results.length + 1);
assert.equal(sheets[0]?.data[1]?.[0], results[0].email);
assert.equal(sheets[0]?.data[1]?.[4], results[0].reasons.join(', '));
```

Also verify a formula-like email reads back with its protective leading apostrophe.

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `npx.cmd tsx --test features/validation/validationExport.test.ts`

Expected: FAIL because `createValidationWorkbook()` is not implemented.

- [ ] **Step 3: Implement the workbook writer**

Import `writeXlsxFile` from `write-excel-file/browser`. Build a header row with bold white text and purple background, followed by plain safe-value cells. Call it with:

```ts
{
  sheet: 'Validation Results',
  stickyRowsCount: 1,
  columns: [32, 32, 12, 10, 38, 12, 12, 12, 14, 16, 12, 14, 12, 14, 24]
    .map((width) => ({ width })),
}
```

Return `(await writer.toBlob()).arrayBuffer()`.

- [ ] **Step 4: Run export and existing workbook tests**

Run: `npx.cmd tsx --test features/validation/validationExport.test.ts features/validation/bulkWorkbook.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit Excel generation**

```bash
git add features/validation/validationExport.ts features/validation/validationExport.test.ts
git commit -m "feat: generate validation Excel exports"
```

---

### Task 3: Bulk validation export controls and browser downloads

**Files:**
- Modify: `app/(dashboard)/dashboard/validation/bulk/page.tsx`
- Create: `features/validation/validationExportUi.test.ts`

**Interfaces:**
- Consumes: `ExportFilter`, `filterValidationResults()`, `createExportFilename()`, `createValidationCsv()`, and `createValidationWorkbook()` from Task 1 and Task 2.
- Produces: Bulk-page status selection, matching-count display, CSV/XLSX actions, and user-visible export errors.

- [ ] **Step 1: Write a failing source-contract UI test**

Read the bulk page source and assert it contains all filter options and both export labels:

```ts
for (const value of ['all', 'valid', 'invalid', 'risky', 'unknown']) {
  assert.match(source, new RegExp(`value=["']${value}["']`));
}
assert.match(source, /Export CSV/);
assert.match(source, /Export Excel/);
assert.match(source, /matching results/);
```

Also assert that the old local `csvCell` and `downloadResults` implementations no longer exist.

- [ ] **Step 2: Run the focused UI contract test and confirm failure**

Run: `npx.cmd tsx --test features/validation/validationExportUi.test.ts`

Expected: FAIL because the new controls are absent.

- [ ] **Step 3: Integrate filter state and derived result count**

Import the export module, add:

```ts
const [exportFilter, setExportFilter] = useState<ExportFilter>('all');
const filteredResults = result ? filterValidationResults(result.results, exportFilter) : [];
```

Reset `exportFilter` to `all` whenever a new file is selected. Remove the page-local `csvCell()` and `downloadResults()` implementations.

- [ ] **Step 4: Implement one reusable browser download helper and two guarded handlers**

Add a page-local `downloadBlob(blob, filename)` that creates an object URL, appends and clicks a temporary anchor, and revokes/removes it in `finally`. Implement `downloadCsv()` and async `downloadExcel()` using only `filteredResults`. Both handlers return immediately for an empty selection, clear old errors first, and set these exact failure messages:

```ts
'The CSV export could not be created. Please try again.'
'The Excel export could not be created. Please try again.'
```

- [ ] **Step 5: Replace the old download button with export controls**

Within the existing validation-results header, add a labeled select for all five filters, render `${filteredResults.length} matching results`, and add `Export CSV` and `Export Excel` buttons. Disable both buttons when `filteredResults.length === 0`. Preserve the existing white cards, borders, purple accent, responsive wrapping, and results table.

- [ ] **Step 6: Run the UI contract and all frontend tests**

Run: `npm.cmd test`

Expected: all tests PASS.

- [ ] **Step 7: Run static and production verification**

Run: `npm.cmd run typecheck`

Expected: exit code 0.

Run: `npm.cmd run build`

Expected: Next.js production build succeeds and includes `/dashboard/validation/bulk`.

Run: `git diff --check`

Expected: no whitespace errors.

- [ ] **Step 8: Commit the bulk-page integration**

```bash
git add app/(dashboard)/dashboard/validation/bulk/page.tsx features/validation/validationExportUi.test.ts
git commit -m "feat: add filtered bulk result exports"
```

---

### Task 4: Final regression and release verification

**Files:**
- Verify only; modify files only if a failing check exposes an issue within this feature's scope.

**Interfaces:**
- Consumes: the complete export feature from Tasks 1–3.
- Produces: evidence that the feature is ready for the existing main-branch deployment workflow.

- [ ] **Step 1: Run the complete verification suite from a clean process**

```bash
npm.cmd test
npm.cmd run typecheck
npm.cmd run build
git diff --check
git status --short
```

Expected: tests, typecheck, and build pass; no whitespace errors; status contains only intentional plan/spec changes if they have not yet been committed.

- [ ] **Step 2: Manually verify the production behavior after deployment**

Upload a workbook containing addresses that produce valid, invalid, and risky results. Confirm each available filter count matches its stat card, download CSV and Excel for every non-empty filter, open both files, and verify the 15 columns and selected records match. Select any empty category, including `unknown` when no live check is inconclusive, and confirm both buttons are disabled. Confirm changing filters does not call the validation API again.

- [ ] **Step 3: Commit any documentation correction and push main**

```bash
git add docs/superpowers/specs/2026-08-09-validation-export-system-design.md docs/superpowers/plans/2026-08-09-validation-export-system.md
git commit -m "docs: plan validation export implementation"
git push origin main
```

If the documentation is already committed, skip the empty commit and push the existing feature commits.

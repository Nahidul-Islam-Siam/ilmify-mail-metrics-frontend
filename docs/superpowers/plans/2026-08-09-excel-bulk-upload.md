# Excel Bulk Upload Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add user-friendly `.xlsx` bulk upload and a downloadable Excel template without changing the existing validation API flow.

**Architecture:** Add a browser-compatible workbook utility that converts the first worksheet into the same normalized email array currently produced from text files. Keep file routing, UI state, and validation submission in the bulk page, and use the same utility to generate the template workbook.

**Tech Stack:** Next.js 14, React 18, TypeScript, Node test runner, SheetJS `xlsx`

## Global Constraints

- Keep CSV and TXT support.
- Support `.xlsx` only; do not support `.xls` or direct Google Sheets API access.
- Read only the first worksheet and accept emails found in any cell.
- Preserve normalization, deduplication, and the 1,000-email limit.
- The template filename is `mailmetric-email-template.xlsx` and its worksheet is `Emails`.

---

### Task 1: Workbook parsing and template generation

**Files:**
- Create: `features/validation/bulkWorkbook.ts`
- Create: `features/validation/bulkWorkbook.test.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Produces: `parseWorkbookEmails(data: ArrayBuffer): string[]`
- Produces: `createEmailTemplateWorkbook(): ArrayBuffer`

- [ ] **Step 1: Install the workbook dependency**

Run: `npm install xlsx`

- [ ] **Step 2: Write failing parser tests**

Create a workbook fixture in memory with mixed columns, duplicates, uppercase addresses, and a second sheet. Assert that `parseWorkbookEmails` returns normalized unique addresses from only the first sheet.

- [ ] **Step 3: Run the focused test and verify RED**

Run: `npx tsx --test features/validation/bulkWorkbook.test.ts`

Expected: FAIL because `bulkWorkbook.ts` does not exist.

- [ ] **Step 4: Implement the minimal parser**

Use `XLSX.read`, select `SheetNames[0]`, convert the sheet with `sheet_to_json(..., { header: 1 })`, flatten string/number cells, and pass their text through a small normalization/deduplication function.

- [ ] **Step 5: Verify parser GREEN**

Run: `npx tsx --test features/validation/bulkWorkbook.test.ts`

Expected: PASS.

- [ ] **Step 6: Write a failing template test**

Read the buffer returned by `createEmailTemplateWorkbook`; assert that the first sheet is `Emails` and its rows equal `[['email'], ['john@example.com'], ['sarah@company.com']]`.

- [ ] **Step 7: Implement template generation and verify GREEN**

Use `aoa_to_sheet`, `book_new`, `book_append_sheet`, and `write(..., { bookType: 'xlsx', type: 'array' })`, then rerun the focused test.

### Task 2: Bulk upload interface

**Files:**
- Modify: `app/(dashboard)/dashboard/validation/bulk/page.tsx`

**Interfaces:**
- Consumes: `parseWorkbookEmails(data)` and `createEmailTemplateWorkbook()` from Task 1.

- [ ] **Step 1: Route uploads by extension**

For `.xlsx`, read `file.arrayBuffer()` and call `parseWorkbookEmails`; for CSV/TXT retain text parsing. Continue rejecting all other extensions.

- [ ] **Step 2: Add the template download action**

Create an XLSX Blob from `createEmailTemplateWorkbook()`, trigger download as `mailmetric-email-template.xlsx`, and revoke the object URL.

- [ ] **Step 3: Improve visible guidance**

Change copy and file input `accept` values to CSV, TXT, and XLSX. Show `Put one email per row under the email column.` and explain that Google Sheets should be downloaded as Microsoft Excel (`.xlsx`).

- [ ] **Step 4: Preserve errors and validation behavior**

Map workbook parsing failures to `This Excel file could not be read. Upload a valid .xlsx workbook.` and retain the empty-file, 1,000-email, authentication refresh, and result behavior.

### Task 3: Verification and delivery

**Files:**
- Verify all modified files.

- [ ] **Step 1: Run all automated checks**

Run: `npm test`

Run: `npm run typecheck`

Run: `npm run build`

Run: `git diff --check`

Expected: all commands succeed.

- [ ] **Step 2: Commit and deploy**

Commit the feature to `main`, push `origin main`, and deploy the production Vercel project.

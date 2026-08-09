# Validation Export System Design

## Objective

Add a production-ready export workflow to the existing bulk validation results without changing the current dashboard visual language or backend validation API. Users can filter completed results by validation status and download the selected records as CSV or Excel.

## MVP Scope

The export controls appear only after a bulk validation request has returned at least one result. They support these result selections:

- All
- Valid
- Invalid
- Risky
- Unknown

The supported download formats are:

- CSV (`.csv`)
- Excel Workbook (`.xlsx`)

Google Sheets export is explicitly deferred. It requires a separate Google OAuth, permissions, and spreadsheet-write integration.

## User Experience

The existing bulk validation page and its upload/results layout remain intact. The current single download action becomes a compact export area in the results section with:

1. A status-filter control.
2. A CSV download action.
3. An Excel download action.
4. A visible count of records included by the selected filter.

When the selected status has no matching records, both download actions are disabled and the interface explains that no results are available for that filter. Export actions must not trigger another validation request.

Downloaded filenames follow this pattern:

`mailmetric-<filter>-YYYY-MM-DD.<extension>`

For example: `mailmetric-valid-2026-08-09.xlsx`.

## Exported Data

CSV and Excel use the same normalized export rows and include these columns in this order:

1. Email
2. Normalized Email
3. Status
4. Score
5. Reasons
6. Syntax
7. DNS
8. MX
9. Disposable
10. Public Provider
11. Blacklist
12. Role Account
13. SMTP
14. Ownership
15. Checked At

Multiple reasons are serialized as a readable comma-separated value. Missing optional values are exported as empty strings, never `undefined` or `[object Object]`.

## Architecture

The feature remains client-side for the MVP because the completed bulk results already exist in Redux/page state and the current maximum upload is small enough for synchronous browser generation.

Export logic is isolated from the page in a validation export module. The module provides small, testable operations for:

- Filtering results by status.
- Mapping API results into stable export rows.
- Producing safe, deterministic filenames.
- Serializing CSV content.
- Producing an Excel workbook.
- Triggering a browser download through a thin UI-facing adapter.

The bulk page owns only the selected filter and invokes these operations. This avoids mixing file-format logic with rendering and keeps a future backend-generated export path possible.

## CSV Behavior

CSV output includes a header row and UTF-8 BOM for reliable spreadsheet compatibility. Fields containing commas, quotes, or newlines are escaped according to CSV conventions. Formula-like values beginning with `=`, `+`, `-`, or `@` are neutralized before export to prevent spreadsheet formula injection.

## Excel Behavior

The existing SheetJS dependency used by bulk workbook upload is reused. The workbook contains one worksheet named `Validation Results` with:

- A styled header row where supported by the current library build.
- Auto-filter across all exported columns.
- A frozen first row where supported.
- Practical column widths based on the known fields.
- Plain cell values that cannot execute spreadsheet formulas.

The export must not add a second spreadsheet library.

## Error Handling

- Export actions stay disabled when there are no matching rows.
- File-generation failures are caught and surfaced through the existing toast/error presentation instead of crashing the page.
- Validation results remain visible after an export failure so the user can retry or choose another format.
- One format failing does not disable the other format permanently.

## Testing

Unit tests cover:

- Every status filter, including `all` and an empty result.
- Stable export column mapping and reason serialization.
- CSV escaping, UTF-8 output, and formula-injection protection.
- Filename generation for every filter and extension.
- Excel worksheet name, headers, row count, auto-filter, and representative cell values.

The existing bulk upload and validation tests must continue to pass. A production build verifies that the browser-only download code does not break Next.js server compilation.

## Deferred Scale Path

When bulk jobs exceed the safe browser limit, the same export-row contract can move behind an asynchronous backend export endpoint. The backend would create the file, store it temporarily, and return a signed download URL. This is not part of the current MVP.

## Acceptance Criteria

- A user can export all completed bulk-validation results as CSV or XLSX.
- A user can export only valid, invalid, risky, or unknown results.
- The displayed filtered count matches the downloaded row count.
- Both formats contain the same columns and records for a selected filter.
- Empty selections cannot produce misleading blank downloads.
- Spreadsheet formula injection is prevented.
- The existing dashboard design, validation API, and upload workflow continue to work.

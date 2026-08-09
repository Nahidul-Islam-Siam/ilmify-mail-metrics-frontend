# Excel Bulk Upload Design

## Goal

Make bulk validation easier by accepting modern Excel workbooks and providing a clearly formatted template.

## Upload contract

- Keep CSV and TXT uploads.
- Add `.xlsx` uploads; legacy `.xls` is not supported.
- Google Sheets users export their sheet as Microsoft Excel (`.xlsx`) before uploading.
- Read the first worksheet and find email addresses in any cell.
- Normalize emails to lowercase, remove duplicates, and enforce the existing 1,000-email limit.
- Reject unreadable, password-protected, empty, or unsupported workbooks with a clear message.

## Template and interface

- Add a `Download Excel template` action beside the file chooser.
- Generate a workbook named `mailmetric-email-template.xlsx`.
- Its first worksheet is named `Emails`, with an `email` header and two example addresses.
- Explain: `Put one email per row under the email column.`
- Update file-picker copy and accepted extensions to CSV, TXT, and XLSX.

## Architecture

Workbook parsing and template generation live in a focused utility, separate from the page and API client. The bulk page selects the parser by extension, then sends the resulting email list through the existing validation and token-refresh flow. The `xlsx` package handles Office Open XML parsing and writing in the browser.

## Testing

- Prove an XLSX workbook's first worksheet yields normalized, unique emails from arbitrary columns.
- Prove later worksheets are ignored.
- Prove the generated template contains the `Emails` sheet, header, and example rows.
- Run the complete test suite, TypeScript check, and production build.

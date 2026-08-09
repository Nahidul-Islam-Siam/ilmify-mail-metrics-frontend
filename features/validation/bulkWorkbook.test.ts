import assert from 'node:assert/strict';
import { test } from 'node:test';
import readXlsxFile from 'read-excel-file/node';
import writeXlsxFile from 'write-excel-file/node';
import { createEmailTemplateWorkbook, parseWorkbookEmails } from './bulkWorkbook';

test('parses normalized unique emails from any cell in the first worksheet only', async () => {
  const writer = writeXlsxFile(
    [
      { sheet: 'Contacts', data: [
        [{ value: 'Name' }, { value: 'Email' }],
        [{ value: 'John' }, { value: 'JOHN@example.com' }],
        [{ value: 'Duplicate' }, { value: 'john@example.com' }],
        [{ value: 'Mixed cells: sarah@company.com; invalid' }, { value: 42 }],
      ] },
      { sheet: 'Ignored', data: [[{ value: 'ignored@second-sheet.com' }]] },
    ],
  );
  const workbook = await writer.toBuffer();

  const data = Uint8Array.from(workbook).buffer;
  assert.deepEqual(await parseWorkbookEmails(data), [
    'john@example.com',
    'sarah@company.com',
  ]);
});

test('creates an Emails worksheet with a clear header and example rows', async () => {
  const workbook = await createEmailTemplateWorkbook();
  const sheets = await readXlsxFile(Buffer.from(workbook));

  assert.equal(sheets[0]?.sheet, 'Emails');
  assert.deepEqual(sheets[0]?.data, [
    ['email'],
    ['john@example.com'],
    ['sarah@company.com'],
  ]);
  assert.deepEqual(await parseWorkbookEmails(workbook), [
    'john@example.com',
    'sarah@company.com',
  ]);
});

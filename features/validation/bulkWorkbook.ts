import readXlsxFile from 'read-excel-file/browser';
import writeXlsxFile from 'write-excel-file/browser';

function extractEmails(values: unknown[]): string[] {
  return Array.from(
    new Set(
      values
        .flatMap((value) => String(value ?? '').split(/[\s,;]+/))
        .map((value) => value.trim().toLowerCase())
        .filter((value) => value.includes('@')),
    ),
  );
}

export async function parseWorkbookEmails(data: ArrayBuffer | Blob): Promise<string[]> {
  const sheets = await readXlsxFile(data);
  const firstSheet = sheets[0];
  if (!firstSheet) return [];

  return extractEmails(firstSheet.data.flat());
}

export async function createEmailTemplateWorkbook(): Promise<ArrayBuffer> {
  const writer = writeXlsxFile(
    [
      [{ value: 'email', fontWeight: 'bold' }],
      [{ value: 'john@example.com' }],
      [{ value: 'sarah@company.com' }],
    ],
    { sheet: 'Emails', columns: [{ width: 32 }] },
  );

  return (await writer.toBlob()).arrayBuffer();
}

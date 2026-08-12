import type { EmailValidationResult, ValidationStatus } from './types';
import writeXlsxFile from 'write-excel-file/browser';

export type ExportFilter = 'all' | ValidationStatus;
export type ExportFormat = 'csv' | 'xlsx';

export interface ExportRow {
  Email: string;
  'Normalized Email': string;
  Status: ValidationStatus;
  Deliverability: string;
  'Email Type': string;
  Verification: string;
  'Risk Flags': string;
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

export const EXPORT_HEADERS: Array<keyof ExportRow> = [
  'Email', 'Normalized Email', 'Status', 'Deliverability', 'Email Type', 'Verification',
  'Risk Flags', 'Score', 'Reasons', 'Syntax', 'DNS', 'MX',
  'Disposable', 'Public Provider', 'Blacklist', 'Role Account', 'SMTP', 'Ownership', 'Checked At',
];

export function filterValidationResults(
  results: EmailValidationResult[],
  filter: ExportFilter,
): EmailValidationResult[] {
  return filter === 'all' ? results : results.filter(({ status }) => status === filter);
}

export function mapValidationResultToExportRow(result: EmailValidationResult): ExportRow {
  return {
    Email: result.email,
    'Normalized Email': result.normalizedEmail,
    Status: result.status,
    Deliverability: result.deliverabilityStatus,
    'Email Type': result.emailType,
    Verification: result.verificationStatus,
    'Risk Flags': result.riskFlags.join(', '),
    Score: result.score,
    Reasons: result.reasons.join(', '),
    Syntax: result.checks.syntax,
    DNS: result.checks.dns,
    MX: result.checks.mx,
    Disposable: result.checks.disposable,
    'Public Provider': result.checks.publicProvider,
    Blacklist: result.checks.blacklist,
    'Role Account': result.checks.roleAccount,
    SMTP: result.checks.smtp,
    Ownership: result.checks.ownership,
    'Checked At': result.checkedAt,
  };
}

export function createExportFilename(
  filter: ExportFilter,
  format: ExportFormat,
  date = new Date(),
): string {
  return `mailmetric-${filter}-${date.toISOString().slice(0, 10)}.${format}`;
}

function safeSpreadsheetValue(value: string | number): string | number {
  return typeof value === 'string' && /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function csvCell(value: string | number): string {
  const safeValue = String(safeSpreadsheetValue(value));
  return /[",\r\n]/.test(safeValue) ? `"${safeValue.replace(/"/g, '""')}"` : safeValue;
}

export function createValidationCsv(results: EmailValidationResult[]): string {
  const rows = results.map(mapValidationResultToExportRow);
  const lines = [
    EXPORT_HEADERS.join(','),
    ...rows.map((row) => EXPORT_HEADERS.map((header) => csvCell(row[header])).join(',')),
  ];
  return `\uFEFF${lines.join('\r\n')}`;
}

export async function createValidationWorkbook(results: EmailValidationResult[]): Promise<ArrayBuffer> {
  const rows = results.map(mapValidationResultToExportRow);
  const data = [
    EXPORT_HEADERS.map((header) => ({
      value: header,
      fontWeight: 'bold' as const,
      fontColor: '#FFFFFF',
      backgroundColor: '#7C3AED',
    })),
    ...rows.map((row) => EXPORT_HEADERS.map((header) => ({
      value: safeSpreadsheetValue(row[header]),
    }))),
  ];
  const writer = writeXlsxFile(data, {
    sheet: 'Validation Results',
    stickyRowsCount: 1,
    columns: [32, 32, 12, 16, 16, 16, 38, 10, 38, 12, 12, 12, 14, 16, 12, 14, 12, 14, 24]
      .map((width) => ({ width })),
  });

  return (await writer.toBlob()).arrayBuffer();
}

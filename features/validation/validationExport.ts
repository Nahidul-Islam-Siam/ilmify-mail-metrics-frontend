import type { EmailValidationResult, ValidationStatus } from './types';

export type ExportFilter = 'all' | ValidationStatus;
export type ExportFormat = 'csv' | 'xlsx';

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

export const EXPORT_HEADERS: Array<keyof ExportRow> = [
  'Email', 'Normalized Email', 'Status', 'Score', 'Reasons', 'Syntax', 'DNS', 'MX',
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

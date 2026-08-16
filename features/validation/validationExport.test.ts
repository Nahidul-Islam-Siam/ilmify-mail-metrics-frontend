import assert from 'node:assert/strict';
import { test } from 'node:test';
import readXlsxFile from 'read-excel-file/node';
import type { EmailValidationResult, ValidationStatus } from './types';
import {
  EXPORT_HEADERS,
  createExportFilename,
  createValidationCsv,
  createValidationWorkbook,
  filterValidationResults,
  mapValidationResultToExportRow,
} from './validationExport';

function result(status: ValidationStatus, email = `${status}@example.com`): EmailValidationResult {
  return {
    email,
    normalizedEmail: email.toLowerCase(),
    status,
    deliverabilityStatus: status === 'invalid' ? 'undeliverable' : status === 'risky' ? 'risky' : status === 'unknown' ? 'unknown' : 'deliverable',
    emailType: 'free_provider',
    verificationStatus: 'unverified',
    riskFlags: ['ROLE_ACCOUNT', 'SMTP_NOT_CHECKED'],
    reason: status === 'valid' ? 'ACCEPTED_EMAIL' : status === 'unknown'
      ? 'MAILBOX_NOT_CHECKED' : 'ROLE_ACCOUNT',
    recommendation: status === 'valid' ? 'safe_to_use' : status === 'unknown'
      ? 'retry_later' : 'use_with_caution',
    score: status === 'unknown' ? null : status === 'valid' ? 90 : 40,
    mailbox: {
      outcome: status === 'valid' ? 'accepted' : 'skipped',
      reason: status === 'valid' ? 'ACCEPTED_EMAIL' : 'MAILBOX_NOT_CHECKED',
      durationMs: 0,
    },
    checks: {
      syntax: 'pass', required: 'pass', length: 'pass', atSign: 'pass',
      localPart: 'pass', domainPart: 'pass', tld: 'pass', spaces: 'pass',
      characters: 'pass', consecutiveDots: 'pass', dotPosition: 'pass', rfc: 'pass',
      dns: 'pass', mx: 'pass', disposable: 'pass', publicProvider: 'fail',
      routing: 'mx', routingCheck: 'pass',
      blacklist: 'pass', roleAccount: 'warn', smtp: 'skipped', ownership: 'not_verified',
    },
    reasons: status === 'valid' ? ['ACCEPTED_EMAIL'] : status === 'unknown'
      ? ['MAILBOX_NOT_CHECKED', 'ROLE_ACCOUNT'] : ['ROLE_ACCOUNT'],
    checkedAt: '2026-08-09T12:00:00.000Z',
    expiresAt: '2026-08-10T12:00:00.000Z',
  };
}

test('filters validation results by every supported status', () => {
  const results = (['valid', 'invalid', 'risky', 'unknown'] as const).map((status) => result(status));

  assert.equal(filterValidationResults(results, 'all').length, 4);
  for (const status of ['valid', 'invalid', 'risky', 'unknown'] as const) {
    assert.deepEqual(filterValidationResults(results, status).map((item) => item.status), [status]);
  }
});

test('maps the complete validation result to stable export columns', () => {
  const row = mapValidationResultToExportRow(result('risky'));

  assert.deepEqual(Object.keys(row), EXPORT_HEADERS);
  assert.equal(row.Status, 'risky');
  assert.equal(row.Reason, 'ROLE_ACCOUNT');
  assert.equal(row.Recommendation, 'use_with_caution');
  assert.equal(row['Mailbox Outcome'], 'skipped');
  assert.equal(row.Routing, 'mx');
  assert.equal(row['Email Type'], 'free_provider');
  assert.equal(row.Verification, 'unverified');
  assert.equal(row['Risk Flags'], 'ROLE_ACCOUNT, SMTP_NOT_CHECKED');
  assert.equal(row.Reasons, 'ROLE_ACCOUNT');
  assert.equal(row['Public Provider'], 'fail');
  assert.equal(row.Ownership, 'not_verified');
});

test('exports an unknown result with an empty quality-score cell', () => {
  const row = mapValidationResultToExportRow(result('unknown'));

  assert.equal(row.Status, 'unknown');
  assert.equal(row['Quality Score'], '');
});

test('creates deterministic dated filenames', () => {
  const date = new Date('2026-08-09T12:00:00.000Z');

  assert.equal(createExportFilename('valid', 'csv', date), 'mailmetric-valid-2026-08-09.csv');
  assert.equal(createExportFilename('all', 'xlsx', date), 'mailmetric-all-2026-08-09.xlsx');
});

test('creates UTF-8 CSV with escaped cells and spreadsheet injection protection', () => {
  const risky = result('risky', '+malicious@example.com');
  const csv = createValidationCsv([
    risky,
    result('invalid', '=SUM(A1:A2)@example.com'),
    result('invalid', '-formula@example.com'),
    result('invalid', '@formula.example.com'),
  ]);

  assert.ok(csv.startsWith('\uFEFFEmail,Normalized Email,Status'));
  assert.match(csv, /Status,Reason,Recommendation,Quality Score,Mailbox Outcome,Routing/);
  assert.match(csv, /'\+malicious@example\.com/);
  assert.match(csv, /'=SUM\(A1:A2\)@example\.com/);
  assert.match(csv, /'-formula@example\.com/);
  assert.match(csv, /'@formula\.example\.com/);
});

test('creates a styled validation workbook with stable rows and safe values', async () => {
  const results = [result('valid'), result('risky', '+malicious@example.com')];
  const workbook = await createValidationWorkbook(results);
  const sheets = await readXlsxFile(Buffer.from(workbook));

  assert.equal(sheets[0]?.sheet, 'Validation Results');
  assert.deepEqual(sheets[0]?.data[0], EXPORT_HEADERS);
  assert.equal(sheets[0]?.data.length, results.length + 1);
  assert.equal(sheets[0]?.data[1]?.[0], results[0].email);
  assert.equal(
    sheets[0]?.data[1]?.[EXPORT_HEADERS.indexOf('Reasons')],
    results[0].reasons.join(', '),
  );
  assert.equal(sheets[0]?.data[2]?.[0], "'+malicious@example.com");
});

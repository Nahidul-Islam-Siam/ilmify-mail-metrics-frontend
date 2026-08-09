import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { EmailValidationResult, ValidationStatus } from './types';
import {
  EXPORT_HEADERS,
  createExportFilename,
  createValidationCsv,
  filterValidationResults,
  mapValidationResultToExportRow,
} from './validationExport';

function result(status: ValidationStatus, email = `${status}@example.com`): EmailValidationResult {
  return {
    email,
    normalizedEmail: email.toLowerCase(),
    status,
    score: status === 'valid' ? 90 : 40,
    checks: {
      syntax: 'pass', required: 'pass', length: 'pass', atSign: 'pass',
      localPart: 'pass', domainPart: 'pass', tld: 'pass', spaces: 'pass',
      characters: 'pass', consecutiveDots: 'pass', dotPosition: 'pass', rfc: 'pass',
      dns: 'pass', mx: 'pass', disposable: 'pass', publicProvider: 'fail',
      blacklist: 'pass', roleAccount: 'warn', smtp: 'skipped', ownership: 'not_verified',
    },
    reasons: ['ROLE_ACCOUNT', 'PUBLIC_EMAIL_RESTRICTED'],
    checkedAt: '2026-08-09T12:00:00.000Z',
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
  assert.equal(row.Reasons, 'ROLE_ACCOUNT, PUBLIC_EMAIL_RESTRICTED');
  assert.equal(row['Public Provider'], 'fail');
  assert.equal(row.Ownership, 'not_verified');
});

test('creates deterministic dated filenames', () => {
  const date = new Date('2026-08-09T12:00:00.000Z');

  assert.equal(createExportFilename('valid', 'csv', date), 'mailmetric-valid-2026-08-09.csv');
  assert.equal(createExportFilename('all', 'xlsx', date), 'mailmetric-all-2026-08-09.xlsx');
});

test('creates UTF-8 CSV with escaped cells and spreadsheet injection protection', () => {
  const risky = result('risky', '+malicious@example.com');
  risky.reasons = ['reason, with comma', 'line\nbreak', 'quote "inside"'];
  const csv = createValidationCsv([
    risky,
    result('invalid', '=SUM(A1:A2)@example.com'),
    result('invalid', '-formula@example.com'),
    result('invalid', '@formula.example.com'),
  ]);

  assert.ok(csv.startsWith('\uFEFFEmail,Normalized Email,Status'));
  assert.match(csv, /'\+malicious@example\.com/);
  assert.match(csv, /'=SUM\(A1:A2\)@example\.com/);
  assert.match(csv, /'-formula@example\.com/);
  assert.match(csv, /'@formula\.example\.com/);
  assert.match(csv, /"reason, with comma, line\nbreak, quote ""inside"""/);
});

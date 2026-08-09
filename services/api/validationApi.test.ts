import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseEmailValidationResponse, ValidationApiError } from './validationApi';

test('validation API errors preserve the response status for refresh handling', () => {
  assert.equal(new ValidationApiError(401, 'Unauthorized').status, 401);
});

test('parses and preserves the complete validation security contract', () => {
  const result = {
    email: 'test@example.com', normalizedEmail: 'test@example.com', status: 'valid', score: 90,
    checks: {
      syntax: 'pass', required: 'pass', length: 'pass', atSign: 'pass', localPart: 'pass',
      domainPart: 'pass', tld: 'pass', spaces: 'pass', characters: 'pass', consecutiveDots: 'pass',
      dotPosition: 'pass', rfc: 'pass', dns: 'pass', mx: 'pass', disposable: 'pass',
      publicProvider: 'pass', blacklist: 'pass', roleAccount: 'pass', smtp: 'skipped',
      ownership: 'not_verified',
    },
    reasons: [], checkedAt: '2026-08-09T00:00:00.000Z',
  };
  assert.deepEqual(parseEmailValidationResponse({ ok: true, status: 200, data: result }), result);
});

test('rejects incomplete validation check contracts', () => {
  assert.throws(() => parseEmailValidationResponse({
    email: 'test@example.com', normalizedEmail: 'test@example.com', status: 'valid', score: 90,
    checks: { syntax: 'pass' }, reasons: [], checkedAt: '2026-08-09T00:00:00.000Z',
  }), /Invalid validation response/);
});

test('rejects unsupported validation check outcomes', () => {
  const checks = {
    syntax: 'pass', required: 'pass', length: 'pass', atSign: 'pass', localPart: 'pass',
    domainPart: 'pass', tld: 'pass', spaces: 'pass', characters: 'pass', consecutiveDots: 'pass',
    dotPosition: 'pass', rfc: 'pass', dns: 'pass', mx: 'pass', disposable: 'pass',
    publicProvider: 'pass', blacklist: 'pass', roleAccount: 'pass', smtp: 'skipped', ownership: 'maybe',
  };
  assert.throws(() => parseEmailValidationResponse({
    email: 'test@example.com', normalizedEmail: 'test@example.com', status: 'valid', score: 90,
    checks, reasons: [], checkedAt: '2026-08-09T00:00:00.000Z',
  }), /Invalid validation response/);
});

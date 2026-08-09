import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseEmailValidationResponse, ValidationApiError } from './validationApi';

test('validation API errors preserve the response status for refresh handling', () => {
  assert.equal(new ValidationApiError(401, 'Unauthorized').status, 401);
});

test('parses a validation result from the backend response envelope', () => {
  const result = { email: 'test@example.com', normalizedEmail: 'test@example.com', status: 'valid', score: 100, checks: { syntax: 'pass', dns: 'pass', mx: 'pass', disposable: 'pass', roleAccount: 'pass', smtp: 'pass' }, reasons: [], checkedAt: '2026-08-09T00:00:00.000Z' };
  assert.deepEqual(parseEmailValidationResponse({ ok: true, status: 200, data: result }), result);
});

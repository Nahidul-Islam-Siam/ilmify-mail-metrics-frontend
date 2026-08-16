import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  parseEmailValidationResponse,
  validateSingleEmail,
  ValidationApiError,
} from './validationApi';

test('requests single validation through the versioned API root', async () => {
  const originalFetch = globalThis.fetch;
  let requestUrl = '';
  let requestInit: RequestInit | undefined;
  globalThis.fetch = async (input, init) => {
    requestUrl = String(input);
    requestInit = init;
    return new Response(null, { status: 401 });
  };

  try {
    await assert.rejects(
      validateSingleEmail('user@example.com', 'access-token'),
      ValidationApiError,
    );
    assert.equal(requestUrl, '/api/v1/validation/single');
    assert.deepEqual(JSON.parse(String(requestInit?.body)), {
      email: 'user@example.com',
      smtp: true,
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('validation API errors preserve the response status for refresh handling', () => {
  assert.equal(new ValidationApiError(401, 'Unauthorized').status, 401);
});

test('parses and preserves the complete validation security contract', () => {
  const result = {
    email: 'test@example.com', normalizedEmail: 'test@example.com', status: 'valid', score: 90,
    deliverabilityStatus: 'deliverable', emailType: 'business',
    verificationStatus: 'unverified', riskFlags: ['SMTP_NOT_CHECKED'],
    checks: {
      syntax: 'pass', required: 'pass', length: 'pass', atSign: 'pass', localPart: 'pass',
      domainPart: 'pass', tld: 'pass', spaces: 'pass', characters: 'pass', consecutiveDots: 'pass',
      dotPosition: 'pass', rfc: 'pass', dns: 'pass', mx: 'pass', disposable: 'pass',
      publicProvider: 'pass', blacklist: 'pass', roleAccount: 'pass', smtp: 'skipped',
      ownership: 'not_verified',
    },
    reasons: ['SMTP_NOT_CHECKED'], checkedAt: '2026-08-09T00:00:00.000Z',
  };
  assert.deepEqual(parseEmailValidationResponse({ ok: true, status: 200, data: result }), result);
});

test('parses a deliverable Gmail address as a free provider without claiming ownership', () => {
  const result = {
    email: 'siamnahidul094@gmail.com',
    normalizedEmail: 'siamnahidul094@gmail.com',
    status: 'valid',
    deliverabilityStatus: 'deliverable',
    emailType: 'free_provider',
    verificationStatus: 'unverified',
    riskFlags: ['SMTP_NOT_CHECKED'],
    score: 90,
    checks: {
      syntax: 'pass', required: 'pass', length: 'pass', atSign: 'pass', localPart: 'pass',
      domainPart: 'pass', tld: 'pass', spaces: 'pass', characters: 'pass', consecutiveDots: 'pass',
      dotPosition: 'pass', rfc: 'pass', dns: 'pass', mx: 'pass', disposable: 'pass',
      publicProvider: 'fail', blacklist: 'pass', roleAccount: 'pass', smtp: 'skipped',
      ownership: 'not_verified',
    },
    reasons: ['SMTP_NOT_CHECKED'],
    checkedAt: '2026-08-12T00:00:00.000Z',
  };

  assert.deepEqual(parseEmailValidationResponse({ data: result }), result);
});

test('rejects unsupported classification values and risk flags', () => {
  const base = {
    email: 'test@example.com', normalizedEmail: 'test@example.com', status: 'valid', score: 90,
    deliverabilityStatus: 'deliverable', emailType: 'business',
    verificationStatus: 'unverified', riskFlags: ['SMTP_NOT_CHECKED'],
    checks: {
      syntax: 'pass', required: 'pass', length: 'pass', atSign: 'pass', localPart: 'pass',
      domainPart: 'pass', tld: 'pass', spaces: 'pass', characters: 'pass', consecutiveDots: 'pass',
      dotPosition: 'pass', rfc: 'pass', dns: 'pass', mx: 'pass', disposable: 'pass',
      publicProvider: 'pass', blacklist: 'pass', roleAccount: 'pass', smtp: 'skipped',
      ownership: 'not_verified',
    },
    reasons: ['SMTP_NOT_CHECKED'], checkedAt: '2026-08-12T00:00:00.000Z',
  };

  for (const invalid of [
    { deliverabilityStatus: 'probably' },
    { emailType: 'personal' },
    { verificationStatus: 'pending' },
    { riskFlags: ['MADE_UP_FLAG'] },
  ]) {
    assert.throws(
      () => parseEmailValidationResponse({ data: { ...base, ...invalid } }),
      /Invalid validation response/,
    );
  }
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

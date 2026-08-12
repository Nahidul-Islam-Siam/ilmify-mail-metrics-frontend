import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { DEFAULT_FILTERS, type SendEmailInput } from '@/features/valid-contacts/validContacts';
import {
  buildValidContactsQuery,
  getValidContactsSummary,
  listValidContacts,
  parseEmailSendResult,
  parseValidContactsPage,
  parseValidContactsSummary,
  sendContactEmail,
  ValidContactsApiError,
} from './validContactsApi';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

const contact = {
  _id: '507f1f77bcf86cd799439011',
  email: 'one@example.com',
  validationStatus: 'valid',
  contactStatus: 'sendable',
  score: 98,
  source: 'single',
  lastValidatedAt: '2026-08-11T10:00:00.000Z',
};

const pageEnvelope = {
  ok: true,
  data: [{ ...contact, lastSendStatus: 'accepted' }],
  pagination: {
    currentPage: 1,
    totalItems: 1,
    totalPages: 1,
    itemsPerPage: 20,
    sendableTotal: 1,
  },
};

test('serializes server filters and omits all-valued filters', () => {
  assert.equal(
    buildValidContactsQuery({
      ...DEFAULT_FILTERS,
      search: ' acme ',
      validationStatus: 'all',
      source: 'bulk',
      activity: 'never_sent',
    }, 2, 20),
    'search=acme&source=bulk&activity=never_sent&sort=newest&page=2&limit=20',
  );
});

test('maps the intercepted list envelope and accepted send state', () => {
  const page = parseValidContactsPage(pageEnvelope);

  assert.equal(page.contacts[0]?.id, contact._id);
  assert.equal(page.contacts[0]?.lastSendStatus, 'sent');
  assert.deepEqual(
    { total: page.total, page: page.page, limit: page.limit, totalPages: page.totalPages, sendableTotal: page.sendableTotal },
    { total: 1, page: 1, limit: 20, totalPages: 1, sendableTotal: 1 },
  );
});

test('maps missing send state to never_sent', () => {
  const page = parseValidContactsPage({
    ...pageEnvelope,
    data: [contact],
  });

  assert.equal(page.contacts[0]?.lastSendStatus, 'never_sent');
});

test('parses summary and send result envelopes', () => {
  assert.deepEqual(parseValidContactsSummary({
    data: { valid: 4, risky: 2, suppressed: 1, sent: 3, neverSent: 2 },
  }), { valid: 4, risky: 2, suppressed: 1, sent: 3, neverSent: 2 });
  assert.deepEqual(parseEmailSendResult({
    data: {
      status: 'partial_failure',
      requestedCount: 2,
      eligibleCount: 2,
      acceptedCount: 1,
      failedCount: 1,
    },
  }), {
    status: 'partial_failure',
    requestedCount: 2,
    eligibleCount: 2,
    acceptedCount: 1,
    failedCount: 1,
  });
});

test('lists contacts with bearer authentication and an abort signal', async () => {
  const controller = new AbortController();
  let requestUrl = '';
  let requestInit: RequestInit | undefined;
  globalThis.fetch = async (input, init) => {
    requestUrl = String(input);
    requestInit = init;
    return new Response(JSON.stringify(pageEnvelope), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  await listValidContacts(DEFAULT_FILTERS, 1, 20, 'access-token', controller.signal);

  assert.equal(
    requestUrl,
    '/api/v1/valid-contacts?sort=newest&page=1&limit=20',
  );
  assert.equal((requestInit?.headers as Record<string, string>).Authorization, 'Bearer access-token');
  assert.equal(requestInit?.signal, controller.signal);
});

test('loads summary and posts an exact send payload', async () => {
  const requests: Array<{ url: string; init?: RequestInit }> = [];
  const sendInput: SendEmailInput = {
    clientRequestId: 'e67c6fca-9380-4db3-98e6-c5c5f72211d2',
    subject: 'Hello',
    message: 'Message',
    contactIds: ['507f1f77bcf86cd799439011'],
  };
  globalThis.fetch = async (input, init) => {
    requests.push({ url: String(input), init });
    const body = init?.method === 'POST'
      ? { status: 'completed', requestedCount: 1, eligibleCount: 1, acceptedCount: 1, failedCount: 0 }
      : { valid: 1, risky: 0, suppressed: 0, sent: 0, neverSent: 1 };
    return new Response(JSON.stringify({ data: body }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  await getValidContactsSummary('access-token');
  await sendContactEmail(sendInput, 'access-token');

  assert.equal(requests[0]?.url, '/api/v1/valid-contacts/summary');
  assert.equal(requests[1]?.url, '/api/v1/email-sends');
  assert.equal(requests[1]?.init?.method, 'POST');
  assert.equal((requests[1]?.init?.headers as Record<string, string>)['Content-Type'], 'application/json');
  assert.equal((requests[1]?.init?.headers as Record<string, string>).Authorization, 'Bearer access-token');
  assert.deepEqual(JSON.parse(String(requests[1]?.init?.body)), sendInput);
});

test('preserves API status and backend validation messages', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({
    message: ['subject must be shorter', 'message should not be empty'],
  }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });

  await assert.rejects(
    getValidContactsSummary('access-token'),
    (error: unknown) => error instanceof ValidContactsApiError
      && error.status === 400
      && error.message === 'subject must be shorter, message should not be empty',
  );
});

test('rejects malformed backend contracts', () => {
  assert.throws(
    () => parseValidContactsPage({ data: [{}], pagination: {} }),
    /Invalid valid contacts response/,
  );
  assert.equal(new ValidContactsApiError(401, 'Session expired.').status, 401);
});

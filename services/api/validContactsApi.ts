import type {
  ContactFilters,
  EmailSendResult,
  SendEmailInput,
  ValidatedContact,
  ValidContactsPage,
  ValidContactsSummary,
} from '@/features/valid-contacts/validContacts';
import { buildApiUrl } from './apiUrl';

const VALIDATION_STATUSES = ['valid', 'risky'] as const;
const CONTACT_STATUSES = [
  'sendable',
  'do_not_contact',
  'unsubscribed',
  'bounced',
] as const;
const CONTACT_SOURCES = ['single', 'bulk'] as const;
const SEND_STATUSES = ['completed', 'partial_failure', 'failed'] as const;

export class ValidContactsApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ValidContactsApiError';
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function isOneOf<Value extends string>(
  value: unknown,
  values: readonly Value[],
): value is Value {
  return typeof value === 'string' && values.includes(value as Value);
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function unwrapData(value: unknown): unknown {
  const envelope = asRecord(value);
  return envelope && 'data' in envelope ? envelope.data : value;
}

function invalidResponse(name: string): never {
  throw new ValidContactsApiError(502, `Invalid ${name} response.`);
}

function parseContact(value: unknown): ValidatedContact {
  const record = asRecord(value);
  if (
    !record
    || typeof record._id !== 'string'
    || typeof record.email !== 'string'
    || !isOneOf(record.validationStatus, VALIDATION_STATUSES)
    || !isOneOf(record.contactStatus, CONTACT_STATUSES)
    || !isNumber(record.score)
    || !isOneOf(record.source, CONTACT_SOURCES)
    || typeof record.lastValidatedAt !== 'string'
    || (record.lastSentAt !== undefined && typeof record.lastSentAt !== 'string')
    || (
      record.lastSendStatus !== undefined
      && record.lastSendStatus !== 'accepted'
      && record.lastSendStatus !== 'failed'
    )
  ) {
    return invalidResponse('valid contacts');
  }

  return {
    id: record._id,
    email: record.email,
    validationStatus: record.validationStatus,
    contactStatus: record.contactStatus,
    score: record.score,
    source: record.source,
    lastValidatedAt: record.lastValidatedAt,
    ...(typeof record.lastSentAt === 'string'
      ? { lastSentAt: record.lastSentAt }
      : {}),
    lastSendStatus: record.lastSendStatus === 'accepted'
      ? 'sent'
      : record.lastSendStatus === 'failed'
        ? 'failed'
        : 'never_sent',
  };
}

export function buildValidContactsQuery(
  filters: ContactFilters,
  page: number,
  limit: number,
): string {
  const query = new URLSearchParams();
  const search = filters.search.trim();
  if (search) query.set('search', search);
  if (filters.validationStatus !== 'all') {
    query.set('validationStatus', filters.validationStatus);
  }
  if (filters.source !== 'all') query.set('source', filters.source);
  if (filters.activity !== 'all') query.set('activity', filters.activity);
  if (filters.dateFrom) query.set('dateFrom', filters.dateFrom);
  if (filters.dateTo) query.set('dateTo', filters.dateTo);
  query.set('sort', filters.sort);
  query.set('page', String(page));
  query.set('limit', String(limit));
  return query.toString();
}

export function parseValidContactsPage(value: unknown): ValidContactsPage {
  const envelope = asRecord(value);
  const contacts = envelope?.data;
  const pagination = asRecord(envelope?.pagination);
  if (
    !Array.isArray(contacts)
    || !pagination
    || !isNumber(pagination.currentPage)
    || !isNumber(pagination.totalItems)
    || !isNumber(pagination.totalPages)
    || !isNumber(pagination.itemsPerPage)
    || !isNumber(pagination.sendableTotal)
  ) {
    return invalidResponse('valid contacts');
  }

  return {
    contacts: contacts.map(parseContact),
    total: pagination.totalItems,
    page: pagination.currentPage,
    limit: pagination.itemsPerPage,
    totalPages: pagination.totalPages,
    sendableTotal: pagination.sendableTotal,
  };
}

export function parseValidContactsSummary(
  value: unknown,
): ValidContactsSummary {
  const summary = asRecord(unwrapData(value));
  if (
    !summary
    || !isNumber(summary.valid)
    || !isNumber(summary.risky)
    || !isNumber(summary.suppressed)
    || !isNumber(summary.sent)
    || !isNumber(summary.neverSent)
  ) {
    return invalidResponse('valid contacts summary');
  }
  return {
    valid: summary.valid,
    risky: summary.risky,
    suppressed: summary.suppressed,
    sent: summary.sent,
    neverSent: summary.neverSent,
  };
}

export function parseEmailSendResult(value: unknown): EmailSendResult {
  const result = asRecord(unwrapData(value));
  if (
    !result
    || !isOneOf(result.status, SEND_STATUSES)
    || !isNumber(result.requestedCount)
    || !isNumber(result.eligibleCount)
    || !isNumber(result.acceptedCount)
    || !isNumber(result.failedCount)
  ) {
    return invalidResponse('email send');
  }
  return {
    status: result.status,
    requestedCount: result.requestedCount,
    eligibleCount: result.eligibleCount,
    acceptedCount: result.acceptedCount,
    failedCount: result.failedCount,
  };
}

function errorMessage(body: unknown, fallback: string): string {
  const record = asRecord(body);
  if (typeof record?.message === 'string') return record.message;
  if (Array.isArray(record?.message)) {
    const messages = record.message.filter(
      (item): item is string => typeof item === 'string',
    );
    if (messages.length > 0) return messages.join(', ');
  }
  return fallback;
}

async function requestJson(
  path: string,
  accessToken: string,
  init: RequestInit = {},
): Promise<unknown> {
  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...init.headers,
    },
  });
  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  if (!response.ok) {
    throw new ValidContactsApiError(
      response.status,
      errorMessage(body, 'The valid contacts request failed.'),
    );
  }
  return body;
}

export async function listValidContacts(
  filters: ContactFilters,
  page: number,
  limit: number,
  accessToken: string,
  signal?: AbortSignal,
): Promise<ValidContactsPage> {
  const query = buildValidContactsQuery(filters, page, limit);
  return parseValidContactsPage(await requestJson(
    `/valid-contacts?${query}`,
    accessToken,
    { signal },
  ));
}

export async function getValidContactsSummary(
  accessToken: string,
  signal?: AbortSignal,
): Promise<ValidContactsSummary> {
  return parseValidContactsSummary(await requestJson(
    '/valid-contacts/summary',
    accessToken,
    { signal },
  ));
}

export async function sendContactEmail(
  input: SendEmailInput,
  accessToken: string,
): Promise<EmailSendResult> {
  return parseEmailSendResult(await requestJson('/email-sends', accessToken, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  }));
}

import type {
  BulkValidationResult,
  DeliverabilityStatus,
  EmailType,
  EmailValidationResult,
  RiskFlag,
  ValidationStatus,
  VerificationStatus,
} from '@/features/validation/types';
import { buildApiUrl } from './apiUrl';

const STATUSES: ValidationStatus[] = ['valid', 'invalid', 'risky', 'unknown'];
const DELIVERABILITY_STATUSES: DeliverabilityStatus[] = [
  'deliverable', 'risky', 'undeliverable', 'unknown',
];
const EMAIL_TYPES: EmailType[] = ['business', 'free_provider', 'role_account', 'disposable'];
const VERIFICATION_STATUSES: VerificationStatus[] = ['verified', 'unverified'];
const RISK_FLAGS: RiskFlag[] = [
  'EMAIL_REQUIRED', 'EMAIL_TOO_LONG', 'AT_SIGN_INVALID', 'LOCAL_PART_INVALID',
  'DOMAIN_INVALID', 'TLD_INVALID', 'WHITESPACE_NOT_ALLOWED', 'CHARACTERS_INVALID',
  'CONSECUTIVE_DOTS', 'DOT_POSITION_INVALID', 'RFC_SYNTAX_INVALID', 'DNS_NOT_FOUND',
  'MX_NOT_FOUND', 'ROLE_ACCOUNT', 'BLACKLISTED', 'DISPOSABLE_DOMAIN',
  'SMTP_NOT_CHECKED', 'SMTP_INCONCLUSIVE', 'MAILBOX_REJECTED',
  'DNS_TEMPORARILY_UNAVAILABLE', 'DISPOSABLE_CHECK_UNAVAILABLE',
  'BLACKLIST_CHECK_UNAVAILABLE',
];
const CHECK_KEYS = [
  'syntax', 'required', 'length', 'atSign', 'localPart', 'domainPart', 'tld', 'spaces',
  'characters', 'consecutiveDots', 'dotPosition', 'rfc', 'dns', 'mx', 'disposable',
  'publicProvider', 'blacklist', 'roleAccount', 'smtp', 'ownership',
] as const;

function hasCompleteChecks(value: unknown): value is EmailValidationResult['checks'] {
  if (!value || typeof value !== 'object') return false;
  const checks = value as Record<string, unknown>;
  const outcomes: Record<(typeof CHECK_KEYS)[number], readonly string[]> = {
    syntax: ['pass', 'fail'], required: ['pass', 'fail'], length: ['pass', 'fail'],
    atSign: ['pass', 'fail'], localPart: ['pass', 'fail'], domainPart: ['pass', 'fail'],
    tld: ['pass', 'fail'], spaces: ['pass', 'fail'], characters: ['pass', 'fail'],
    consecutiveDots: ['pass', 'fail'], dotPosition: ['pass', 'fail'], rfc: ['pass', 'fail'],
    dns: ['pass', 'fail', 'unknown'], mx: ['pass', 'fail', 'unknown'],
    disposable: ['pass', 'fail', 'unknown'], publicProvider: ['pass', 'fail'],
    blacklist: ['pass', 'fail', 'unknown'], roleAccount: ['pass', 'warn'],
    smtp: ['pass', 'fail', 'unknown', 'skipped'], ownership: ['verified', 'not_verified'],
  };
  return CHECK_KEYS.every((key) =>
    typeof checks[key] === 'string' && outcomes[key].includes(checks[key] as string));
}

export class ValidationApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ValidationApiError';
  }
}

function isEmailValidationResult(value: unknown): value is EmailValidationResult {
  if (!value || typeof value !== 'object') return false;
  const result = value as Record<string, unknown>;
  return (
    typeof result.email === 'string' &&
    typeof result.normalizedEmail === 'string' &&
    typeof result.status === 'string' &&
    STATUSES.includes(result.status as ValidationStatus) &&
    typeof result.deliverabilityStatus === 'string' &&
    DELIVERABILITY_STATUSES.includes(result.deliverabilityStatus as DeliverabilityStatus) &&
    typeof result.emailType === 'string' &&
    EMAIL_TYPES.includes(result.emailType as EmailType) &&
    typeof result.verificationStatus === 'string' &&
    VERIFICATION_STATUSES.includes(result.verificationStatus as VerificationStatus) &&
    Array.isArray(result.riskFlags) &&
    result.riskFlags.every((flag) =>
      typeof flag === 'string' && RISK_FLAGS.includes(flag as RiskFlag)) &&
    typeof result.score === 'number' &&
    hasCompleteChecks(result.checks) &&
    Array.isArray(result.reasons) &&
    typeof result.checkedAt === 'string'
  );
}

function unwrapData(value: unknown): unknown {
  if (value && typeof value === 'object' && 'data' in value) {
    return (value as { data: unknown }).data;
  }
  return value;
}

export function parseEmailValidationResponse(value: unknown): EmailValidationResult {
  const result = unwrapData(value);
  if (!isEmailValidationResult(result)) throw new Error('Invalid validation response');
  return result;
}

export async function validateSingleEmail(
  email: string,
  accessToken?: string | null,
  smtp = true,
): Promise<EmailValidationResult> {
  const response = await fetch(buildApiUrl('/validation/single'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
    body: JSON.stringify({ email: email.trim().toLowerCase(), smtp }),
  });
  if (!response.ok) throw new ValidationApiError(response.status, `Validation failed (${response.status})`);
  return parseEmailValidationResponse(await response.json());
}

export const validateEmail = validateSingleEmail;

export async function validateBulkEmails(
  emails: string[],
  accessToken?: string | null,
): Promise<BulkValidationResult> {
  const response = await fetch(buildApiUrl('/validation/bulk'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
    body: JSON.stringify({ emails }),
  });
  if (!response.ok) throw new ValidationApiError(response.status, `Bulk validation failed (${response.status})`);
  const body = unwrapData(await response.json());
  if (!body || typeof body !== 'object') throw new Error('Invalid bulk validation response');
  const result = body as Record<string, unknown>;
  if (
    typeof result.total !== 'number' ||
    typeof result.processed !== 'number' ||
    typeof result.deliverable !== 'number' ||
    typeof result.undeliverable !== 'number' ||
    typeof result.valid !== 'number' ||
    typeof result.invalid !== 'number' ||
    typeof result.risky !== 'number' ||
    typeof result.unknown !== 'number' ||
    !Array.isArray(result.results) ||
    !result.results.every(isEmailValidationResult)
  ) {
    throw new Error('Invalid bulk validation response');
  }
  return body as BulkValidationResult;
}

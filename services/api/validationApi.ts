import type {
  BulkValidationResult,
  EmailValidationResult,
  ValidationStatus,
} from '@/features/validation/types';
import { buildApiUrl } from './apiUrl';

const STATUSES: ValidationStatus[] = ['valid', 'invalid', 'risky', 'unknown'];

function isEmailValidationResult(value: unknown): value is EmailValidationResult {
  if (!value || typeof value !== 'object') return false;
  const result = value as Record<string, unknown>;
  return (
    typeof result.email === 'string' &&
    typeof result.normalizedEmail === 'string' &&
    typeof result.status === 'string' &&
    STATUSES.includes(result.status as ValidationStatus) &&
    typeof result.score === 'number' &&
    !!result.checks &&
    typeof result.checks === 'object' &&
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
  smtp = true,
  accessToken?: string | null,
): Promise<EmailValidationResult> {
  const response = await fetch(buildApiUrl('/api/validation/single'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
    body: JSON.stringify({ email: email.trim().toLowerCase(), smtp }),
  });
  if (!response.ok) throw new Error(`Validation failed (${response.status})`);
  return parseEmailValidationResponse(await response.json());
}

export const validateEmail = validateSingleEmail;

export async function validateBulkEmails(
  emails: string[],
  accessToken?: string | null,
): Promise<BulkValidationResult> {
  const response = await fetch(buildApiUrl('/api/validation/bulk'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
    body: JSON.stringify({ emails }),
  });
  if (!response.ok) throw new Error(`Bulk validation failed (${response.status})`);
  const body = unwrapData(await response.json());
  if (!body || typeof body !== 'object') throw new Error('Invalid bulk validation response');
  const result = body as Record<string, unknown>;
  if (
    typeof result.total !== 'number' ||
    typeof result.processed !== 'number' ||
    !Array.isArray(result.results) ||
    !result.results.every(isEmailValidationResult)
  ) {
    throw new Error('Invalid bulk validation response');
  }
  return body as BulkValidationResult;
}

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

export async function validateSingleEmail(
  email: string,
  smtp = true,
): Promise<EmailValidationResult> {
  const response = await fetch(buildApiUrl('/api/validation/single'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim().toLowerCase(), smtp }),
  });
  if (!response.ok) throw new Error(`Validation failed (${response.status})`);
  const body: unknown = await response.json();
  if (!isEmailValidationResult(body)) throw new Error('Invalid validation response');
  return body;
}

export const validateEmail = validateSingleEmail;

export async function validateBulkEmails(
  emails: string[],
): Promise<BulkValidationResult> {
  const response = await fetch(buildApiUrl('/api/validation/bulk'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emails }),
  });
  if (!response.ok) throw new Error(`Bulk validation failed (${response.status})`);
  const body: unknown = await response.json();
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

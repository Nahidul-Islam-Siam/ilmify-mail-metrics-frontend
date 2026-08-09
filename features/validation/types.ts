export type ValidationStatus = 'valid' | 'invalid' | 'risky' | 'unknown';
export type ValidationCheckState = 'pass' | 'fail' | 'warn' | 'unknown' | 'skipped';

export interface EmailValidationResult {
  email: string;
  normalizedEmail: string;
  status: ValidationStatus;
  score: number;
  checks: {
    syntax: 'pass' | 'fail';
    dns: 'pass' | 'fail' | 'unknown';
    mx: 'pass' | 'fail' | 'unknown';
    disposable: 'pass' | 'fail';
    publicProvider: 'pass' | 'fail';
    roleAccount: 'pass' | 'warn';
    smtp: 'pass' | 'fail' | 'unknown' | 'skipped';
  };
  reasons: string[];
  checkedAt: string;
}

export interface BulkValidationResult {
  total: number;
  processed: number;
  valid: number;
  invalid: number;
  risky: number;
  unknown: number;
  results: EmailValidationResult[];
}

export type ValidationStatus = 'valid' | 'invalid' | 'risky' | 'unknown';
export type ValidationCheckState = 'pass' | 'fail' | 'warn' | 'unknown' | 'skipped';

export interface EmailValidationResult {
  email: string;
  normalizedEmail: string;
  status: ValidationStatus;
  score: number;
  checks: {
    syntax: 'pass' | 'fail';
    required: 'pass' | 'fail';
    length: 'pass' | 'fail';
    atSign: 'pass' | 'fail';
    localPart: 'pass' | 'fail';
    domainPart: 'pass' | 'fail';
    tld: 'pass' | 'fail';
    spaces: 'pass' | 'fail';
    characters: 'pass' | 'fail';
    consecutiveDots: 'pass' | 'fail';
    dotPosition: 'pass' | 'fail';
    rfc: 'pass' | 'fail';
    dns: 'pass' | 'fail' | 'unknown';
    mx: 'pass' | 'fail' | 'unknown';
    disposable: 'pass' | 'fail' | 'unknown';
    publicProvider: 'pass' | 'fail';
    blacklist: 'pass' | 'fail' | 'unknown';
    roleAccount: 'pass' | 'warn';
    smtp: 'pass' | 'fail' | 'unknown' | 'skipped';
    ownership: 'verified' | 'not_verified';
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

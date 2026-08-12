export type ValidationStatus = 'valid' | 'invalid' | 'risky' | 'unknown';
export type ValidationCheckState = 'pass' | 'fail' | 'warn' | 'unknown' | 'skipped';
export type DeliverabilityStatus = 'deliverable' | 'risky' | 'undeliverable' | 'unknown';
export type EmailType = 'business' | 'free_provider' | 'role_account' | 'disposable';
export type VerificationStatus = 'verified' | 'unverified';
export type RiskFlag =
  | 'EMAIL_REQUIRED'
  | 'EMAIL_TOO_LONG'
  | 'AT_SIGN_INVALID'
  | 'LOCAL_PART_INVALID'
  | 'DOMAIN_INVALID'
  | 'TLD_INVALID'
  | 'WHITESPACE_NOT_ALLOWED'
  | 'CHARACTERS_INVALID'
  | 'CONSECUTIVE_DOTS'
  | 'DOT_POSITION_INVALID'
  | 'RFC_SYNTAX_INVALID'
  | 'DNS_NOT_FOUND'
  | 'MX_NOT_FOUND'
  | 'ROLE_ACCOUNT'
  | 'BLACKLISTED'
  | 'DISPOSABLE_DOMAIN'
  | 'SMTP_NOT_CHECKED'
  | 'SMTP_INCONCLUSIVE'
  | 'MAILBOX_REJECTED'
  | 'DNS_TEMPORARILY_UNAVAILABLE'
  | 'DISPOSABLE_CHECK_UNAVAILABLE'
  | 'BLACKLIST_CHECK_UNAVAILABLE';

export interface EmailValidationResult {
  email: string;
  normalizedEmail: string;
  status: ValidationStatus;
  deliverabilityStatus: DeliverabilityStatus;
  emailType: EmailType;
  verificationStatus: VerificationStatus;
  riskFlags: RiskFlag[];
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
  deliverable: number;
  undeliverable: number;
  valid: number;
  invalid: number;
  risky: number;
  unknown: number;
  results: EmailValidationResult[];
}

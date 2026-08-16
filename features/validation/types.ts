export type ValidationStatus = 'valid' | 'invalid' | 'risky' | 'unknown';
export type ValidationCheckState = 'pass' | 'fail' | 'warn' | 'unknown' | 'skipped';
export type DeliverabilityStatus = 'deliverable' | 'risky' | 'undeliverable' | 'unknown';
export type EmailType = 'business' | 'free_provider' | 'role_account' | 'disposable';
export type VerificationStatus = 'verified' | 'unverified';
export type ValidationRecommendation =
  | 'safe_to_use'
  | 'use_with_caution'
  | 'do_not_use'
  | 'retry_later';
export type MailboxProbeOutcome =
  | 'accepted'
  | 'rejected'
  | 'catch_all'
  | 'temporary'
  | 'blocked'
  | 'timeout'
  | 'unavailable'
  | 'unexpected'
  | 'skipped';
export type MailRouting = 'mx' | 'implicit' | 'null_mx' | 'none' | 'unknown';
export type RiskFlag =
  | 'SYNTAX_INVALID'
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
export type ValidationReason =
  | RiskFlag
  | 'ACCEPTED_EMAIL'
  | 'NULL_MX'
  | 'NO_MAIL_ROUTING'
  | 'MAILBOX_NOT_CONFIRMED'
  | 'MAILBOX_NOT_CHECKED'
  | 'MAILBOX_VERIFICATION_UNAVAILABLE'
  | 'SMTP_TIMEOUT'
  | 'SMTP_TEMPORARY_FAILURE'
  | 'SMTP_BLOCKED'
  | 'SMTP_UNEXPECTED'
  | 'CATCH_ALL_DOMAIN';

export interface MailboxProbeResult {
  outcome: MailboxProbeOutcome;
  reason: ValidationReason;
  mxHost?: string;
  replyCode?: number;
  replyClass?: 2 | 4 | 5;
  durationMs: number;
  retryAfterMs?: number;
  catchAll?: 'confirmed' | 'not_detected' | 'unknown';
}

export interface EmailValidationResult {
  email: string;
  normalizedEmail: string;
  status: ValidationStatus;
  deliverabilityStatus: DeliverabilityStatus;
  emailType: EmailType;
  verificationStatus: VerificationStatus;
  riskFlags: RiskFlag[];
  reason: ValidationReason;
  recommendation: ValidationRecommendation;
  score: number | null;
  mailbox: MailboxProbeResult;
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
    routing: MailRouting;
    routingCheck: 'pass' | 'fail' | 'unknown';
    disposable: 'pass' | 'fail' | 'unknown';
    publicProvider: 'pass' | 'fail';
    blacklist: 'pass' | 'fail' | 'unknown';
    roleAccount: 'pass' | 'warn';
    smtp: 'pass' | 'fail' | 'unknown' | 'skipped';
    ownership: 'verified' | 'not_verified';
  };
  reasons: ValidationReason[];
  checkedAt: string;
  expiresAt: string;
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

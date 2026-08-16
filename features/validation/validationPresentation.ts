import type {
  DeliverabilityStatus,
  EmailType,
  EmailValidationResult,
  RiskFlag,
  VerificationStatus,
} from './types';

export type ValidationBadgeTone = 'success' | 'warning' | 'danger' | 'neutral';

export interface ValidationBadge {
  label: string;
  tone: ValidationBadgeTone;
}

const DELIVERABILITY_BADGES: Record<DeliverabilityStatus, ValidationBadge> = {
  deliverable: { label: 'Deliverable', tone: 'success' },
  risky: { label: 'Risky', tone: 'warning' },
  undeliverable: { label: 'Undeliverable', tone: 'danger' },
  unknown: { label: 'Unknown', tone: 'neutral' },
};

const EMAIL_TYPE_BADGES: Record<EmailType, ValidationBadge> = {
  business: { label: 'Business', tone: 'neutral' },
  free_provider: { label: 'Free provider', tone: 'neutral' },
  role_account: { label: 'Role account', tone: 'warning' },
  disposable: { label: 'Disposable', tone: 'danger' },
};

const VERIFICATION_BADGES: Record<VerificationStatus, ValidationBadge> = {
  verified: { label: 'Verified', tone: 'success' },
  unverified: { label: 'Unverified', tone: 'warning' },
};

const RISK_FLAG_LABELS: Record<RiskFlag, string> = {
  SYNTAX_INVALID: 'Invalid email syntax',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_TOO_LONG: 'Email is too long',
  AT_SIGN_INVALID: 'Invalid @ sign',
  LOCAL_PART_INVALID: 'Invalid local part',
  DOMAIN_INVALID: 'Invalid domain',
  TLD_INVALID: 'Invalid top-level domain',
  WHITESPACE_NOT_ALLOWED: 'Whitespace is not allowed',
  CHARACTERS_INVALID: 'Invalid characters',
  CONSECUTIVE_DOTS: 'Consecutive dots are not allowed',
  DOT_POSITION_INVALID: 'Invalid dot position',
  RFC_SYNTAX_INVALID: 'Invalid email syntax',
  DNS_NOT_FOUND: 'DNS record not found',
  MX_NOT_FOUND: 'Mail server not found',
  ROLE_ACCOUNT: 'Role-based account',
  BLACKLISTED: 'Email is blacklisted',
  DISPOSABLE_DOMAIN: 'Disposable email domain',
  SMTP_NOT_CHECKED: 'SMTP mailbox not checked',
  SMTP_INCONCLUSIVE: 'SMTP mailbox check was inconclusive',
  MAILBOX_REJECTED: 'Mailbox was rejected',
  DNS_TEMPORARILY_UNAVAILABLE: 'DNS check temporarily unavailable',
  DISPOSABLE_CHECK_UNAVAILABLE: 'Disposable-domain check unavailable',
  BLACKLIST_CHECK_UNAVAILABLE: 'Blacklist check unavailable',
};

type ValidationClassification = Pick<
  EmailValidationResult,
  'deliverabilityStatus' | 'emailType' | 'verificationStatus'
>;

export function getValidationBadges(result: ValidationClassification): ValidationBadge[] {
  return [
    DELIVERABILITY_BADGES[result.deliverabilityStatus],
    EMAIL_TYPE_BADGES[result.emailType],
    VERIFICATION_BADGES[result.verificationStatus],
  ];
}

export function getRiskSummary(riskFlags: RiskFlag[]): string {
  return riskFlags.length === 0
    ? 'No risk signals found'
    : riskFlags.map((flag) => RISK_FLAG_LABELS[flag]).join(', ');
}

export function getQualityScoreLabel(score: number | null): string {
  return score === null ? 'No quality score' : `Quality score ${score}/100`;
}

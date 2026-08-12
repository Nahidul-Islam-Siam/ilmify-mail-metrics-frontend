import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { EmailValidationResult } from './types';
import {
  getRiskSummary,
  getValidationBadges,
} from './validationPresentation';

const gmailResult = {
  deliverabilityStatus: 'deliverable',
  emailType: 'free_provider',
  verificationStatus: 'unverified',
  riskFlags: ['SMTP_NOT_CHECKED'],
} as EmailValidationResult;

test('presents Gmail classification as separate, accurate badges', () => {
  assert.deepEqual(getValidationBadges(gmailResult), [
    { label: 'Deliverable', tone: 'success' },
    { label: 'Free provider', tone: 'neutral' },
    { label: 'Unverified', tone: 'warning' },
  ]);
});

test('maps every classification value to human-readable badges', () => {
  assert.deepEqual(getValidationBadges({
    ...gmailResult,
    deliverabilityStatus: 'undeliverable',
    emailType: 'role_account',
    verificationStatus: 'verified',
  }), [
    { label: 'Undeliverable', tone: 'danger' },
    { label: 'Role account', tone: 'warning' },
    { label: 'Verified', tone: 'success' },
  ]);

  assert.equal(getValidationBadges({
    ...gmailResult,
    deliverabilityStatus: 'unknown',
    emailType: 'disposable',
  })[0]?.label, 'Unknown deliverability');
  assert.equal(getValidationBadges({
    ...gmailResult,
    deliverabilityStatus: 'risky',
    emailType: 'business',
  })[1]?.label, 'Business');
});

test('explains an informational SMTP-not-checked flag without calling it a risk', () => {
  assert.equal(getRiskSummary(gmailResult.riskFlags), 'SMTP mailbox not checked');
  assert.equal(getRiskSummary([]), 'No risk signals found');
});

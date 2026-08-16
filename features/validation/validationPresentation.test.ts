import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { EmailValidationResult } from './types';
import {
  getRiskSummary,
  getQualityScoreLabel,
  getValidationBadges,
} from './validationPresentation';

const gmailResult = {
  deliverabilityStatus: 'unknown',
  emailType: 'free_provider',
  verificationStatus: 'unverified',
  riskFlags: ['SMTP_NOT_CHECKED'],
} as EmailValidationResult;

test('does not present unprobed Gmail as deliverable', () => {
  assert.deepEqual(getValidationBadges(gmailResult), [
    { label: 'Unknown', tone: 'neutral' },
    { label: 'Free provider', tone: 'neutral' },
    { label: 'Unverified', tone: 'warning' },
  ]);
});

test('labels nullable quality scores without implying mailbox probability', () => {
  assert.equal(getQualityScoreLabel(null), 'No quality score');
  assert.equal(getQualityScoreLabel(90), 'Quality score 90/100');
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
  })[0]?.label, 'Unknown');
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

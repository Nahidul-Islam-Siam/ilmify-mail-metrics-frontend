import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  clearSelection,
  buildSendEmailInput,
  DEFAULT_FILTERS,
  getComposerError,
  getSelectedCount,
  selectAllMatching,
  toggleContact,
  toggleVisibleContacts,
} from './validContacts';

describe('composer validation', () => {
  it('requires at least one sendable recipient', () => {
    assert.equal(getComposerError(0, 'Hello', 'Welcome aboard'), 'Select at least one sendable contact.');
  });

  it('enforces the 25-recipient send limit', () => {
    assert.equal(getComposerError(26, 'Hello', 'Welcome aboard'), 'You can send to a maximum of 25 contacts at a time.');
  });

  it('requires non-whitespace subject and message content', () => {
    assert.equal(getComposerError(2, '  ', 'Welcome aboard'), 'Add a subject before sending.');
    assert.equal(getComposerError(2, 'Hello', '  '), 'Add a message before sending.');
  });

  it('allows a complete message within the recipient limit', () => {
    assert.equal(getComposerError(25, 'Hello', 'Welcome aboard'), null);
  });
});

describe('contact selection', () => {
  it('selects visible contacts without selecting hidden matching contacts', () => {
    const selection = toggleVisibleContacts(clearSelection(), ['contact-1', 'contact-2'], true);

    assert.deepEqual(selection, {
      mode: 'explicit',
      ids: ['contact-1', 'contact-2'],
    });
    assert.equal(getSelectedCount(selection), 2);
  });

  it('tracks excluded rows when every matching contact is selected', () => {
    const selection = toggleContact(selectAllMatching(8), 'contact-2');

    assert.deepEqual(selection, {
      mode: 'allMatching',
      total: 8,
      excludedIds: ['contact-2'],
    });
    assert.equal(getSelectedCount(selection), 7);
  });

  it('clears either selection mode to an empty explicit selection', () => {
    assert.deepEqual(clearSelection(), { mode: 'explicit', ids: [] });
    assert.deepEqual(clearSelection(selectAllMatching(12)), { mode: 'explicit', ids: [] });
  });

  it('builds an explicit recipient payload', () => {
    assert.deepEqual(buildSendEmailInput(
      { mode: 'explicit', ids: ['contact-1', 'contact-2'] },
      DEFAULT_FILTERS,
      ' Hello ',
      ' Message ',
      'e67c6fca-9380-4db3-98e6-c5c5f72211d2',
    ), {
      clientRequestId: 'e67c6fca-9380-4db3-98e6-c5c5f72211d2',
      subject: 'Hello',
      message: 'Message',
      contactIds: ['contact-1', 'contact-2'],
    });
  });

  it('builds all-matching filters and exclusions without UI-only values', () => {
    assert.deepEqual(buildSendEmailInput(
      { mode: 'allMatching', total: 8, excludedIds: ['contact-3'] },
      {
        ...DEFAULT_FILTERS,
        validationStatus: 'all',
        deliverabilityStatus: 'deliverable',
        emailType: 'free_provider',
        verificationStatus: 'unverified',
        source: 'bulk',
        activity: 'failed',
        search: ' acme ',
        dateFrom: '2026-08-01',
      },
      'Hello',
      'Message',
      'e67c6fca-9380-4db3-98e6-c5c5f72211d2',
    ), {
      clientRequestId: 'e67c6fca-9380-4db3-98e6-c5c5f72211d2',
      subject: 'Hello',
      message: 'Message',
      allMatching: {
        search: 'acme',
        deliverabilityStatus: 'deliverable',
        emailType: 'free_provider',
        verificationStatus: 'unverified',
        source: 'bulk',
        activity: 'failed',
        dateFrom: '2026-08-01',
        excludedIds: ['contact-3'],
      },
    });
  });
});

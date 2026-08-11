import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  clearSelection,
  DEFAULT_FILTERS,
  filterContacts,
  getComposerError,
  getSelectedCount,
  selectAllMatching,
  toggleContact,
  toggleVisibleContacts,
  type ValidatedContact,
} from './validContacts';

const contacts: ValidatedContact[] = [
  {
    id: 'contact-1',
    email: 'ava@northstar.io',
    validationStatus: 'valid',
    contactStatus: 'sendable',
    score: 98,
    source: 'single',
    lastValidatedAt: '2026-08-10T10:00:00.000Z',
    lastSendStatus: 'never_sent',
  },
  {
    id: 'contact-2',
    email: 'sam@acme.co',
    validationStatus: 'risky',
    contactStatus: 'sendable',
    score: 63,
    source: 'bulk',
    lastValidatedAt: '2026-08-11T10:00:00.000Z',
    lastSendStatus: 'failed',
  },
  {
    id: 'contact-3',
    email: 'billing@northstar.io',
    validationStatus: 'valid',
    contactStatus: 'do_not_contact',
    score: 94,
    source: 'bulk',
    lastValidatedAt: '2026-08-09T10:00:00.000Z',
    lastSendStatus: 'sent',
  },

  {
    id: 'contact-4',
    email: 'siamnahidul093@gmail.com',
    validationStatus: 'valid',
    contactStatus: 'sendable',
    score: 85,
    source: 'single',
    lastValidatedAt: '2026-08-12T10:00:00.000Z',
    lastSendStatus: 'never_sent',
  }
];

describe('valid contact filtering', () => {
  it('defaults the list to valid contacts in newest-first order', () => {
    assert.deepEqual(
      filterContacts(contacts, DEFAULT_FILTERS).map(({ id }) => id),
      ['contact-1', 'contact-3', 'contact-4', 'contact-2'],
    );
  });

  it('combines search, source, activity, and score sorting', () => {
    assert.deepEqual(
      filterContacts(contacts, {
        ...DEFAULT_FILTERS,
        search: 'northstar',
        source: 'bulk',
        activity: 'sent',
        sort: 'lowest_score',
      }).map(({ id }) => id),
      ['contact-3'],
    );
  });
});

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
});

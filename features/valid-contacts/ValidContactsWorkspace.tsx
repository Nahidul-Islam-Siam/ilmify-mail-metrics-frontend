'use client';

import { type FormEvent, useMemo, useState } from 'react';
import styles from './ValidContactsWorkspace.module.css';
import {
  clearSelection,
  DEFAULT_FILTERS,
  filterContacts,
  getComposerError,
  getSelectedCount,
  isContactSelected,
  MOCK_VALID_CONTACTS,
  selectAllMatching,
  toggleContact,
  toggleVisibleContacts,
  type ContactFilters,
  type ContactSelection,
  type ValidatedContact,
} from './validContacts';

const PAGE_SIZE = 20;
const SHARED_FROM = 'Shared Titan mailbox (configured by admin)';

const formatDate = (value: string) => new Intl.DateTimeFormat('en', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
}).format(new Date(value));

const getInitials = (email: string) => email
  .split('@')[0]
  .split(/[._-]/)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase())
  .join('');

function SummaryCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={styles.summaryCard}>
      <span className={styles.summaryIcon} style={{ background: `${tone}14`, color: tone }} aria-hidden="true">
        <span style={{ background: tone }} />
      </span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function ContactRow({
  contact,
  selected,
  onToggle,
}: {
  contact: ValidatedContact;
  selected: boolean;
  onToggle: () => void;
}) {
  const sendable = contact.contactStatus === 'sendable';

  return (
    <label className={`${styles.contactRow} ${selected ? styles.selectedRow : ''} ${!sendable ? styles.suppressedRow : ''}`}>
      <input
        className={styles.checkbox}
        type="checkbox"
        checked={selected}
        disabled={!sendable}
        onChange={onToggle}
        aria-label={`Select ${contact.email}`}
      />
      <span className={styles.avatar}>{getInitials(contact.email)}</span>
      <span className={styles.contactIdentity}>
        <strong>{contact.email}</strong>
        <span>
          {contact.source === 'single' ? 'Single validation' : 'Bulk validation'} · {formatDate(contact.lastValidatedAt)}
        </span>
      </span>
      <span className={styles.contactMeta}>
        <span className={`${styles.statusBadge} ${contact.validationStatus === 'valid' ? styles.valid : styles.risky}`}>
          {contact.validationStatus}
        </span>
        {sendable ? (
          <span className={styles.score}>{contact.score}% score</span>
        ) : (
          <span className={`${styles.statusBadge} ${styles.suppressed}`}>{contact.contactStatus.replaceAll('_', ' ')}</span>
        )}
      </span>
    </label>
  );
}

export default function ValidContactsWorkspace() {
  const [filters, setFilters] = useState<ContactFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [selection, setSelection] = useState<ContactSelection>(clearSelection());
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendFeedback, setSendFeedback] = useState<string | null>(null);

  const filteredContacts = useMemo(
    () => filterContacts(MOCK_VALID_CONTACTS, filters),
    [filters],
  );
  const sendableMatches = useMemo(
    () => filteredContacts.filter((contact) => contact.contactStatus === 'sendable'),
    [filteredContacts],
  );
  const pageCount = Math.max(1, Math.ceil(filteredContacts.length / PAGE_SIZE));
  const visibleContacts = filteredContacts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const visibleSendableIds = visibleContacts
    .filter((contact) => contact.contactStatus === 'sendable')
    .map((contact) => contact.id);
  const visibleSelected = visibleSendableIds.length > 0
    && visibleSendableIds.every((id) => isContactSelected(selection, id));
  const selectedContacts = sendableMatches.filter((contact) => isContactSelected(selection, contact.id));
  const selectedCount = getSelectedCount(selection);
  const riskySelected = selectedContacts.filter((contact) => contact.validationStatus === 'risky').length;
  const composerError = getComposerError(selectedCount, subject, message);
  const allVisibleSelected = selection.mode === 'explicit'
    && visibleSendableIds.length > 0
    && visibleSendableIds.every((id) => selection.ids.includes(id));

  const summary = useMemo(() => ({
    valid: MOCK_VALID_CONTACTS.filter(({ validationStatus }) => validationStatus === 'valid').length,
    risky: MOCK_VALID_CONTACTS.filter(({ validationStatus }) => validationStatus === 'risky').length,
    suppressed: MOCK_VALID_CONTACTS.filter(({ contactStatus }) => contactStatus !== 'sendable').length,
    contacted: MOCK_VALID_CONTACTS.filter(({ lastSendStatus }) => lastSendStatus === 'sent').length,
  }), []);

  const updateFilter = <Key extends keyof ContactFilters>(key: Key, value: ContactFilters[Key]) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
    setSelection(clearSelection());
    setSendFeedback(null);
  };

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (composerError) {
      setSendFeedback(composerError);
      return;
    }

    setIsSending(true);
    setSendFeedback(null);
    await new Promise((resolve) => setTimeout(resolve, 650));
    setIsSending(false);
    setSendFeedback(`${selectedCount} ${selectedCount === 1 ? 'email' : 'emails'} queued in this design preview. No message was sent.`);
  };

  return (
    <div className={styles.pageShell}>
      <header className={styles.pageHeader}>
        <div>
          <div className={styles.eyebrow}>Contacts workspace</div>
          <h1>Valid Emails</h1>
          <p>Review verified contacts, choose an audience, and prepare a message from your shared mailbox.</p>
        </div>
        <span className={styles.previewBadge}>Design preview · Mock data</span>
      </header>

      <section className={styles.summaryGrid} aria-label="Contact summary">
        <SummaryCard label="Valid contacts" value={summary.valid} tone="#12B76A" />
        <SummaryCard label="Risky contacts" value={summary.risky} tone="#F79009" />
        <SummaryCard label="Suppressed" value={summary.suppressed} tone="#F04438" />
        <SummaryCard label="Previously contacted" value={summary.contacted} tone="#7C3AED" />
      </section>

      <div className={styles.workspaceGrid}>
        <section className={styles.contactsPanel}>
          <div className={styles.panelHeading}>
            <div>
              <h2>Your email list</h2>
              <p>{filteredContacts.length} matching contacts</p>
            </div>
            {(filters.search || filters.validationStatus !== 'valid' || filters.source !== 'all' || filters.activity !== 'all' || filters.dateFrom || filters.dateTo) && (
              <button
                className={styles.clearButton}
                type="button"
                onClick={() => {
                  setFilters(DEFAULT_FILTERS);
                  setPage(1);
                  setSelection(clearSelection());
                }}
              >
                Reset filters
              </button>
            )}
          </div>

          <div className={styles.filters}>
            <label className={styles.searchField}>
              <span className={styles.srOnly}>Search email</span>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                placeholder="Search email address"
                value={filters.search}
                onChange={(event) => updateFilter('search', event.target.value)}
              />
            </label>
            <label>
              <span>Status</span>
              <select value={filters.validationStatus} onChange={(event) => updateFilter('validationStatus', event.target.value as ContactFilters['validationStatus'])}>
                <option value="valid">Valid only</option>
                <option value="risky">Risky only</option>
                <option value="all">Valid & risky</option>
              </select>
            </label>
            <label>
              <span>Source</span>
              <select value={filters.source} onChange={(event) => updateFilter('source', event.target.value as ContactFilters['source'])}>
                <option value="all">All sources</option>
                <option value="single">Single</option>
                <option value="bulk">Bulk</option>
              </select>
            </label>
            <label>
              <span>Activity</span>
              <select value={filters.activity} onChange={(event) => updateFilter('activity', event.target.value as ContactFilters['activity'])}>
                <option value="all">All activity</option>
                <option value="never_sent">Never sent</option>
                <option value="sent">Sent</option>
                <option value="failed">Failed</option>
              </select>
            </label>
            <label>
              <span>From</span>
              <input type="date" value={filters.dateFrom} onChange={(event) => updateFilter('dateFrom', event.target.value)} />
            </label>
            <label>
              <span>To</span>
              <input type="date" value={filters.dateTo} onChange={(event) => updateFilter('dateTo', event.target.value)} />
            </label>
            <label>
              <span>Sort by</span>
              <select value={filters.sort} onChange={(event) => updateFilter('sort', event.target.value as ContactFilters['sort'])}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest_score">Highest score</option>
                <option value="lowest_score">Lowest score</option>
              </select>
            </label>
          </div>

          <div className={styles.selectionBar}>
            <label>
              <input
                className={styles.checkbox}
                type="checkbox"
                checked={visibleSelected}
                onChange={(event) => setSelection((current) => toggleVisibleContacts(current, visibleSendableIds, event.target.checked))}
                aria-label="Select all sendable contacts on this page"
              />
              Select page
            </label>
            <strong>{selectedCount} selected</strong>
            {selectedCount > 0 && (
              <button type="button" onClick={() => setSelection(clearSelection())}>Clear</button>
            )}
          </div>

          {allVisibleSelected && sendableMatches.length > visibleSendableIds.length && (
            <div className={styles.selectAllBanner}>
              All {visibleSendableIds.length} sendable contacts on this page are selected.
              <button type="button" onClick={() => setSelection(selectAllMatching(sendableMatches.length))}>
                Select all {sendableMatches.length} matching sendable contacts
              </button>
            </div>
          )}

          <div className={styles.contactList}>
            {visibleContacts.length ? visibleContacts.map((contact) => (
              <ContactRow
                key={contact.id}
                contact={contact}
                selected={contact.contactStatus === 'sendable' && isContactSelected(selection, contact.id)}
                onToggle={() => setSelection((current) => toggleContact(current, contact.id))}
              />
            )) : (
              <div className={styles.emptyState}>
                <span>⌕</span>
                <h3>No contacts match these filters</h3>
                <p>Try a broader search or reset the filters.</p>
              </div>
            )}
          </div>

          <footer className={styles.pagination}>
            <span>
              Showing {filteredContacts.length ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, filteredContacts.length)} of {filteredContacts.length}
            </span>
            <div>
              <button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
              <span>Page {page} of {pageCount}</span>
              <button type="button" disabled={page === pageCount} onClick={() => setPage((current) => current + 1)}>Next</button>
            </div>
          </footer>
        </section>

        <aside className={styles.composerPanel}>
          <div className={styles.composerHeading}>
            <span className={styles.composerIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4 6.5h16v11H4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                <path d="m5 8 7 5 7-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <h2>Compose email</h2>
              <p>{selectedCount} of 25 recipients selected</p>
            </div>
          </div>

          <div className={styles.recipientMeter}>
            <span style={{ width: `${Math.min(100, selectedCount * 4)}%` }} />
          </div>

          {selectedCount > 25 && (
            <div className={`${styles.notice} ${styles.errorNotice}`}>
              Remove {selectedCount - 25} {selectedCount - 25 === 1 ? 'contact' : 'contacts'} before sending.
            </div>
          )}
          {riskySelected > 0 && (
            <div className={`${styles.notice} ${styles.warningNotice}`}>
              {riskySelected} risky {riskySelected === 1 ? 'address is' : 'addresses are'} selected. Confirm them carefully before sending.
            </div>
          )}

          <form className={styles.composerForm} onSubmit={handleSend}>
            <label>
              <span>From</span>
              <input value={SHARED_FROM} readOnly />
              <small>Replies will arrive in the shared Titan inbox.</small>
            </label>
            <label>
              <span>Subject</span>
              <input
                value={subject}
                maxLength={200}
                placeholder="Write a clear subject line"
                onChange={(event) => {
                  setSubject(event.target.value);
                  setSendFeedback(null);
                }}
              />
              <small className={styles.characterCount}>{subject.length}/200</small>
            </label>
            <label>
              <span>Message</span>
              <textarea
                value={message}
                maxLength={10000}
                rows={11}
                placeholder={'Hi there,\n\nWrite your message here...'}
                onChange={(event) => {
                  setMessage(event.target.value);
                  setSendFeedback(null);
                }}
              />
              <small className={styles.characterCount}>{message.length}/10,000</small>
            </label>

            {sendFeedback && (
              <div className={`${styles.sendFeedback} ${composerError ? styles.feedbackError : styles.feedbackSuccess}`} role="status" aria-live="polite">
                {sendFeedback}
              </div>
            )}

            <button className={styles.sendButton} type="submit" disabled={Boolean(composerError) || isSending}>
              {isSending ? 'Preparing email…' : `Send ${selectedCount || ''} ${selectedCount === 1 ? 'email' : 'emails'}`.replace('  ', ' ')}
              {!isSending && <span aria-hidden="true">↗</span>}
            </button>
            <p className={styles.composerFootnote}>Each recipient receives a separate email. Addresses are never grouped.</p>
          </form>
        </aside>
      </div>
    </div>
  );
}

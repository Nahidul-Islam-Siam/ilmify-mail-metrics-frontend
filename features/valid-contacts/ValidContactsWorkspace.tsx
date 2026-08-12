'use client';

import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { clearSession } from '@/redux/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  getValidationBadges,
  type ValidationBadgeTone,
} from '@/features/validation/validationPresentation';
import {
  getValidContactsSummary,
  listValidContacts,
  sendContactEmail,
  ValidContactsApiError,
} from '@/services/api/validContactsApi';
import styles from './ValidContactsWorkspace.module.css';
import {
  buildSendEmailInput,
  clearSelection,
  DEFAULT_FILTERS,
  getComposerError,
  getSelectedCount,
  isContactSelected,
  selectAllMatching,
  toggleContact,
  toggleVisibleContacts,
  type ContactFilters,
  type ContactSelection,
  type ValidatedContact,
  type ValidContactsPage,
  type ValidContactsSummary,
} from './validContacts';

const PAGE_SIZE = 20;
const SHARED_FROM = 'Configured SMTP mailbox';

const BADGE_TONE_CLASSES: Record<ValidationBadgeTone, string> = {
  success: styles.valid,
  warning: styles.risky,
  danger: styles.suppressed,
  neutral: styles.neutral,
};

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
        <span className={styles.classificationBadges}>
          {getValidationBadges(contact).map((badge) => (
            <span key={badge.label} className={`${styles.statusBadge} ${BADGE_TONE_CLASSES[badge.tone]}`}>
              {badge.label}
            </span>
          ))}
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
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<ContactFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [selection, setSelection] = useState<ContactSelection>(clearSelection());
  const [contactsPage, setContactsPage] = useState<ValidContactsPage>({
    contacts: [],
    total: 0,
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 0,
    sendableTotal: 0,
  });
  const [summary, setSummary] = useState<ValidContactsSummary>({
    deliverable: 0,
    valid: 0,
    risky: 0,
    suppressed: 0,
    sent: 0,
    neverSent: 0,
  });
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  const [isSending, setIsSending] = useState(false);
  const [sendFeedback, setSendFeedback] = useState<string | null>(null);
  const [sendFeedbackTone, setSendFeedbackTone] = useState<
    'success' | 'warning' | 'error'
  >('success');
  const hasLoadedOnce = useRef(false);

  const visibleContacts = contactsPage.contacts;
  const pageCount = Math.max(1, contactsPage.totalPages);
  const visibleSendableIds = visibleContacts
    .filter((contact) => contact.contactStatus === 'sendable')
    .map((contact) => contact.id);
  const visibleSelected = visibleSendableIds.length > 0
    && visibleSendableIds.every((id) => isContactSelected(selection, id));
  const selectedCount = getSelectedCount(selection);
  const composerError = getComposerError(selectedCount, subject, message);
  const allVisibleSelected = selection.mode === 'explicit'
    && visibleSendableIds.length > 0
    && visibleSendableIds.every((id) => selection.ids.includes(id));

  const hasActiveFilters = Boolean(
    filters.search
    || filters.validationStatus !== DEFAULT_FILTERS.validationStatus
    || filters.deliverabilityStatus !== DEFAULT_FILTERS.deliverabilityStatus
    || filters.emailType !== DEFAULT_FILTERS.emailType
    || filters.verificationStatus !== DEFAULT_FILTERS.verificationStatus
    || filters.source !== DEFAULT_FILTERS.source
    || filters.activity !== DEFAULT_FILTERS.activity
    || filters.dateFrom
    || filters.dateTo,
  );

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedSearch(filters.search),
      300,
    );
    return () => window.clearTimeout(timer);
  }, [filters.search]);

  const requestFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [
      debouncedSearch,
      filters.validationStatus,
      filters.deliverabilityStatus,
      filters.emailType,
      filters.verificationStatus,
      filters.source,
      filters.activity,
      filters.sort,
      filters.dateFrom,
      filters.dateTo,
    ],
  );

  useEffect(() => {
    if (!accessToken) {
      setIsInitialLoading(false);
      setLoadError('Your session has expired. Please sign in again.');
      return;
    }
    const controller = new AbortController();
    const load = async () => {
      setLoadError(null);
      if (hasLoadedOnce.current) setIsRefreshing(true);
      else setIsInitialLoading(true);
      try {
        const [nextPage, nextSummary] = await Promise.all([
          listValidContacts(
            requestFilters,
            page,
            PAGE_SIZE,
            accessToken,
            controller.signal,
          ),
          getValidContactsSummary(accessToken, controller.signal),
        ]);
        setContactsPage(nextPage);
        setSummary(nextSummary);
        hasLoadedOnce.current = true;
      } catch (error) {
        if (controller.signal.aborted) return;
        if (error instanceof ValidContactsApiError && error.status === 401) {
          dispatch(clearSession());
        }
        setLoadError(
          error instanceof Error
            ? error.message
            : 'Unable to load valid contacts.',
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsInitialLoading(false);
          setIsRefreshing(false);
        }
      }
    };
    void load();
    return () => controller.abort();
  }, [accessToken, dispatch, page, reloadKey, requestFilters]);

  const updateFilter = <Key extends keyof ContactFilters>(key: Key, value: ContactFilters[Key]) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
    setSelection(clearSelection());
    setSendFeedback(null);
  };

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (composerError || !accessToken) {
      setSendFeedback(
        composerError ?? 'Your session has expired. Please sign in again.',
      );
      setSendFeedbackTone('error');
      return;
    }

    setIsSending(true);
    setSendFeedback(null);
    try {
      const result = await sendContactEmail(
        buildSendEmailInput(
          selection,
          requestFilters,
          subject,
          message,
          crypto.randomUUID(),
        ),
        accessToken,
      );
      setSendFeedbackTone(
        result.status === 'failed'
          ? 'error'
          : result.failedCount > 0
            ? 'warning'
            : 'success',
      );
      setSendFeedback(
        `${result.acceptedCount} accepted${
          result.failedCount > 0 ? `, ${result.failedCount} failed` : ''
        }.`,
      );
      setSelection(clearSelection());
      setReloadKey((value) => value + 1);
    } catch (error) {
      if (error instanceof ValidContactsApiError && error.status === 401) {
        dispatch(clearSession());
      }
      setSendFeedbackTone('error');
      setSendFeedback(
        error instanceof Error ? error.message : 'Unable to send email.',
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.pageShell}>
      <header className={styles.pageHeader}>
        <div>
          <div className={styles.eyebrow}>Contacts workspace</div>
          <h1>Valid Emails</h1>
          <p>Review verified contacts, choose an audience, and prepare a message from your shared mailbox.</p>
        </div>
      </header>

      <section className={styles.summaryGrid} aria-label="Contact summary">
        <SummaryCard label="Deliverable" value={summary.deliverable} tone="#12B76A" />
        <SummaryCard label="Risky contacts" value={summary.risky} tone="#F79009" />
        <SummaryCard label="Suppressed" value={summary.suppressed} tone="#F04438" />
        <SummaryCard label="Previously contacted" value={summary.sent} tone="#7C3AED" />
      </section>

      <div className={styles.workspaceGrid}>
        <section className={styles.contactsPanel}>
          <div className={styles.panelHeading}>
            <div>
              <h2>Your email list</h2>
              <p>
                {contactsPage.total} matching contacts
                {isRefreshing && <span className={styles.refreshIndicator}>Updating…</span>}
              </p>
            </div>
            {hasActiveFilters && (
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
              <span>Deliverability</span>
              <select value={filters.deliverabilityStatus} onChange={(event) => updateFilter('deliverabilityStatus', event.target.value as ContactFilters['deliverabilityStatus'])}>
                <option value="all">All deliverability</option>
                <option value="deliverable">Deliverable</option>
                <option value="risky">Risky</option>
              </select>
            </label>
            <label>
              <span>Email type</span>
              <select value={filters.emailType} onChange={(event) => updateFilter('emailType', event.target.value as ContactFilters['emailType'])}>
                <option value="all">All email types</option>
                <option value="business">Business</option>
                <option value="free_provider">Free provider</option>
                <option value="role_account">Role account</option>
                <option value="disposable">Disposable</option>
              </select>
            </label>
            <label>
              <span>Verification</span>
              <select value={filters.verificationStatus} onChange={(event) => updateFilter('verificationStatus', event.target.value as ContactFilters['verificationStatus'])}>
                <option value="all">All verification</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
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
                disabled={isRefreshing || visibleSendableIds.length === 0}
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

          {allVisibleSelected && contactsPage.sendableTotal > visibleSendableIds.length && (
            <div className={styles.selectAllBanner}>
              All {visibleSendableIds.length} sendable contacts on this page are selected.
              <button type="button" onClick={() => setSelection(selectAllMatching(contactsPage.sendableTotal))}>
                Select all {contactsPage.sendableTotal} matching sendable contacts
              </button>
            </div>
          )}

          <div className={styles.contactList}>
            {isInitialLoading ? (
              <div className={styles.loadingState}>Loading valid contacts…</div>
            ) : loadError ? (
              <div className={styles.errorState} role="alert">
                <div>
                  <p>{loadError}</p>
                  <button
                    className={styles.retryButton}
                    type="button"
                    onClick={() => setReloadKey((value) => value + 1)}
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : visibleContacts.length ? visibleContacts.map((contact) => (
              <ContactRow
                key={contact.id}
                contact={contact}
                selected={contact.contactStatus === 'sendable' && isContactSelected(selection, contact.id)}
                onToggle={() => setSelection((current) => toggleContact(current, contact.id))}
              />
            )) : (
              <div className={styles.emptyState}>
                <span>⌕</span>
                <h3>{hasActiveFilters ? 'No contacts match these filters' : 'No valid contacts saved yet'}</h3>
                <p>{hasActiveFilters ? 'Try a broader search or reset the filters.' : 'Validate an email to add your first contact.'}</p>
              </div>
            )}
          </div>

          <footer className={styles.pagination}>
            <span>
              Showing {contactsPage.total ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, contactsPage.total)} of {contactsPage.total}
            </span>
            <div>
              <button type="button" disabled={isRefreshing || page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
              <span>Page {page} of {pageCount}</span>
              <button type="button" disabled={isRefreshing || page >= pageCount} onClick={() => setPage((current) => current + 1)}>Next</button>
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
          <form className={styles.composerForm} onSubmit={handleSend}>
            <label>
              <span>From</span>
              <input value={SHARED_FROM} readOnly />
              <small>Replies will arrive in the configured sender inbox.</small>
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
              <div className={`${styles.sendFeedback} ${sendFeedbackTone === 'error' ? styles.feedbackError : sendFeedbackTone === 'warning' ? styles.feedbackWarning : styles.feedbackSuccess}`} role="status" aria-live="polite">
                {sendFeedback}
              </div>
            )}

            <button className={styles.sendButton} type="submit" disabled={Boolean(composerError) || isSending}>
              {isSending ? 'Sending…' : `Send ${selectedCount || ''} ${selectedCount === 1 ? 'email' : 'emails'}`.replace('  ', ' ')}
              {!isSending && <span aria-hidden="true">↗</span>}
            </button>
            <p className={styles.composerFootnote}>Each recipient receives a separate email. Addresses are never grouped.</p>
          </form>
        </aside>
      </div>
    </div>
  );
}

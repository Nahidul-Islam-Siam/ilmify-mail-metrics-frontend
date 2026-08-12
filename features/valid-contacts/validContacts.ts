export type ValidationStatus = 'valid' | 'risky';
export type ContactStatus = 'sendable' | 'do_not_contact' | 'unsubscribed' | 'bounced';
export type ContactSource = 'single' | 'bulk';
export type ContactActivity = 'all' | 'never_sent' | 'sent' | 'failed';
export type ContactSort = 'newest' | 'oldest' | 'highest_score' | 'lowest_score';

export interface ValidatedContact {
  id: string;
  email: string;
  validationStatus: ValidationStatus;
  contactStatus: ContactStatus;
  score: number;
  source: ContactSource;
  lastValidatedAt: string;
  lastSentAt?: string;
  lastSendStatus: 'never_sent' | 'sent' | 'failed';
}

export interface ContactFilters {
  search: string;
  validationStatus: ValidationStatus | 'all';
  source: ContactSource | 'all';
  activity: ContactActivity;
  sort: ContactSort;
  dateFrom: string;
  dateTo: string;
}

export interface ValidContactsPage {
  contacts: ValidatedContact[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  sendableTotal: number;
}

export interface ValidContactsSummary {
  valid: number;
  risky: number;
  suppressed: number;
  sent: number;
  neverSent: number;
}

export interface AllMatchingSelectionInput {
  search?: string;
  validationStatus?: ValidationStatus;
  source?: ContactSource;
  activity?: Exclude<ContactActivity, 'all'>;
  dateFrom?: string;
  dateTo?: string;
  excludedIds?: string[];
}

export interface SendEmailInput {
  clientRequestId: string;
  subject: string;
  message: string;
  contactIds?: string[];
  allMatching?: AllMatchingSelectionInput;
}

export interface EmailSendResult {
  status: 'completed' | 'partial_failure' | 'failed';
  requestedCount: number;
  eligibleCount: number;
  acceptedCount: number;
  failedCount: number;
}

export type ContactSelection =
  | { mode: 'explicit'; ids: string[] }
  | { mode: 'allMatching'; total: number; excludedIds: string[] };

export const DEFAULT_FILTERS: ContactFilters = {
  search: '',
  validationStatus: 'valid',
  source: 'all',
  activity: 'all',
  sort: 'newest',
  dateFrom: '',
  dateTo: '',
};

export function clearSelection(_selection?: ContactSelection): ContactSelection {
  return { mode: 'explicit', ids: [] };
}

export function selectAllMatching(total: number): ContactSelection {
  return { mode: 'allMatching', total, excludedIds: [] };
}

export function getSelectedCount(selection: ContactSelection): number {
  return selection.mode === 'explicit'
    ? selection.ids.length
    : Math.max(0, selection.total - selection.excludedIds.length);
}

export function getComposerError(
  recipientCount: number,
  subject: string,
  message: string,
): string | null {
  if (recipientCount === 0) return 'Select at least one sendable contact.';
  if (recipientCount > 25) return 'You can send to a maximum of 25 contacts at a time.';
  if (!subject.trim()) return 'Add a subject before sending.';
  if (!message.trim()) return 'Add a message before sending.';
  return null;
}

export function buildSendEmailInput(
  selection: ContactSelection,
  filters: ContactFilters,
  subject: string,
  message: string,
  clientRequestId: string,
): SendEmailInput {
  const base = {
    clientRequestId,
    subject: subject.trim(),
    message: message.trim(),
  };
  if (selection.mode === 'explicit') {
    return { ...base, contactIds: selection.ids };
  }
  return {
    ...base,
    allMatching: {
      ...(filters.search.trim() ? { search: filters.search.trim() } : {}),
      ...(filters.validationStatus !== 'all'
        ? { validationStatus: filters.validationStatus }
        : {}),
      ...(filters.source !== 'all' ? { source: filters.source } : {}),
      ...(filters.activity !== 'all' ? { activity: filters.activity } : {}),
      ...(filters.dateFrom ? { dateFrom: filters.dateFrom } : {}),
      ...(filters.dateTo ? { dateTo: filters.dateTo } : {}),
      ...(selection.excludedIds.length
        ? { excludedIds: selection.excludedIds }
        : {}),
    },
  };
}

export function isContactSelected(selection: ContactSelection, contactId: string): boolean {
  return selection.mode === 'explicit'
    ? selection.ids.includes(contactId)
    : !selection.excludedIds.includes(contactId);
}

export function toggleContact(selection: ContactSelection, contactId: string): ContactSelection {
  if (selection.mode === 'explicit') {
    return selection.ids.includes(contactId)
      ? { mode: 'explicit', ids: selection.ids.filter((id) => id !== contactId) }
      : { mode: 'explicit', ids: [...selection.ids, contactId] };
  }

  return selection.excludedIds.includes(contactId)
    ? {
        ...selection,
        excludedIds: selection.excludedIds.filter((id) => id !== contactId),
      }
    : {
        ...selection,
        excludedIds: [...selection.excludedIds, contactId],
      };
}

export function toggleVisibleContacts(
  selection: ContactSelection,
  visibleIds: string[],
  selected: boolean,
): ContactSelection {
  if (selection.mode === 'allMatching') {
    const visibleSet = new Set(visibleIds);
    return {
      ...selection,
      excludedIds: selected
        ? selection.excludedIds.filter((id) => !visibleSet.has(id))
        : Array.from(new Set([...selection.excludedIds, ...visibleIds])),
    };
  }

  const current = new Set(selection.ids);
  visibleIds.forEach((id) => selected ? current.add(id) : current.delete(id));
  return { mode: 'explicit', ids: Array.from(current) };
}

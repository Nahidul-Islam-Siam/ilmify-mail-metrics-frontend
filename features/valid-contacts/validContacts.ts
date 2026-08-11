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

const CONTACT_SEEDS = [
  ['ava.rodriguez', 'northstar.io'],
  ['noah.williams', 'brightpath.co'],
  ['mia.chen', 'horizonlabs.dev'],
  ['liam.anderson', 'summitgroup.io'],
  ['sophia.patel', 'oakandstone.com'],
  ['ethan.brown', 'novaagency.co'],
  ['isabella.kim', 'pineworks.io'],
  ['oliver.martin', 'vertexlabs.dev'],
  ['amelia.jones', 'bluepeak.co'],
  ['lucas.taylor', 'greenline.io'],
  ['harper.davis', 'atlasstudio.com'],
  ['henry.wilson', 'kindredworks.co'],
  ['evelyn.moore', 'orbitgroup.io'],
  ['james.thomas', 'clearwater.dev'],
  ['abigail.white', 'emberlabs.co'],
  ['benjamin.harris', 'silveroak.io'],
  ['ella.clark', 'wildflower.com'],
  ['mateo.lewis', 'tidalworks.co'],
  ['scarlett.young', 'northwind.io'],
  ['daniel.hall', 'stonebridge.dev'],
  ['grace.hernandez', 'sunrisegroup.co'],
  ['jack.king', 'fieldnotes.io'],
  ['chloe.wright', 'redwoodlabs.com'],
  ['sebastian.lopez', 'truepath.co'],
  ['lily.hill', 'moonlight.io'],
  ['samuel.scott', 'copperline.dev'],
  ['zoey.green', 'firstlight.co'],
  ['leo.adams', 'daybreak.io'],
  ['siamnahidul093', 'gmail.com'],
] as const;

export const MOCK_VALID_CONTACTS: ValidatedContact[] = CONTACT_SEEDS.map(([name, domain], index) => {
  const risky = index === 4 || index === 13 || index === 22;
  const contactStatus: ContactStatus = index === 10
    ? 'do_not_contact'
    : index === 17
      ? 'unsubscribed'
      : index === 25
        ? 'bounced'
        : 'sendable';
  const lastSendStatus: ValidatedContact['lastSendStatus'] = index % 4 === 0
    ? 'failed'
    : index % 3 === 0
      ? 'sent'
      : 'never_sent';

  return {
    id: `contact-${index + 1}`,
    email: `${name}@${domain}`,
    validationStatus: risky ? 'risky' : 'valid',
    contactStatus,
    score: risky ? 61 + (index % 8) : 88 + (index % 11),
    source: index % 3 === 0 ? 'single' : 'bulk',
    lastValidatedAt: new Date(Date.UTC(2026, 7, 11 - (index % 10), 10, 20)).toISOString(),
    lastSentAt: lastSendStatus === 'never_sent'
      ? undefined
      : new Date(Date.UTC(2026, 7, 10 - (index % 7), 8, 10)).toISOString(),
    lastSendStatus,
  };
});

export function filterContacts(
  contacts: ValidatedContact[],
  filters: ContactFilters,
): ValidatedContact[] {
  const normalizedSearch = filters.search.trim().toLowerCase();
  const fromTime = filters.dateFrom ? new Date(`${filters.dateFrom}T00:00:00`).getTime() : null;
  const toTime = filters.dateTo ? new Date(`${filters.dateTo}T23:59:59.999`).getTime() : null;

  return contacts
    .filter((contact) => !normalizedSearch || contact.email.toLowerCase().includes(normalizedSearch))
    .filter((contact) => filters.validationStatus === 'all' || contact.validationStatus === filters.validationStatus)
    .filter((contact) => filters.source === 'all' || contact.source === filters.source)
    .filter((contact) => filters.activity === 'all' || contact.lastSendStatus === filters.activity)
    .filter((contact) => {
      const validatedAt = new Date(contact.lastValidatedAt).getTime();
      return (fromTime === null || validatedAt >= fromTime) && (toTime === null || validatedAt <= toTime);
    })
    .sort((left, right) => {
      switch (filters.sort) {
        case 'oldest':
          return new Date(left.lastValidatedAt).getTime() - new Date(right.lastValidatedAt).getTime();
        case 'highest_score':
          return right.score - left.score;
        case 'lowest_score':
          return left.score - right.score;
        case 'newest':
        default:
          return new Date(right.lastValidatedAt).getTime() - new Date(left.lastValidatedAt).getTime();
      }
    });
}

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

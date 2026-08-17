import {
  DEFAULT_FILTERS,
  type ContactFilters,
  type ValidContactsPage,
  type ValidContactsSummary,
} from '@/features/valid-contacts/validContacts';
import {
  getValidContactsSummary,
  listValidContacts,
} from '@/services/api/validContactsApi';

const RECENT_CONTACT_LIMIT = 6;

export interface DashboardOverviewData {
  contactsPage: ValidContactsPage;
  summary: ValidContactsSummary;
}

export interface DashboardDataSource {
  list(
    filters: ContactFilters,
    page: number,
    limit: number,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<ValidContactsPage>;
  summary(
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<ValidContactsSummary>;
}

const defaultDataSource: DashboardDataSource = {
  list: listValidContacts,
  summary: getValidContactsSummary,
};

export async function loadDashboardOverview(
  accessToken: string,
  signal?: AbortSignal,
  source: DashboardDataSource = defaultDataSource,
): Promise<DashboardOverviewData> {
  const [contactsPage, summary] = await Promise.all([
    source.list(
      { ...DEFAULT_FILTERS, sort: 'newest' },
      1,
      RECENT_CONTACT_LIMIT,
      accessToken,
      signal,
    ),
    source.summary(accessToken, signal),
  ]);

  return { contactsPage, summary };
}

export function getDashboardFirstName(
  name?: string | null,
): string | null {
  return name?.trim().split(/\s+/)[0] || null;
}

export function getDashboardPercent(
  part: number,
  total: number,
): number | null {
  return total > 0 ? Math.round((part / total) * 100) : null;
}

export function formatDashboardDate(value: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}

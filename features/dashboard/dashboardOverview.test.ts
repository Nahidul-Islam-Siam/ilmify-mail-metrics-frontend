import assert from 'node:assert/strict';
import { test } from 'node:test';
import type {
  ContactFilters,
  ValidContactsPage,
  ValidContactsSummary,
} from '@/features/valid-contacts/validContacts';
import {
  formatDashboardDate,
  getDashboardFirstName,
  getDashboardPercent,
  loadDashboardOverview,
  type DashboardDataSource,
} from './dashboardOverviewModel';

const contactsPage: ValidContactsPage = {
  contacts: [],
  total: 7,
  page: 1,
  limit: 6,
  totalPages: 2,
  sendableTotal: 6,
};

const summary: ValidContactsSummary = {
  deliverable: 4,
  valid: 4,
  risky: 2,
  suppressed: 1,
  sent: 3,
  neverSent: 2,
};

test('uses a trimmed first name and a neutral fallback', () => {
  assert.equal(getDashboardFirstName('  MailMetric Admin  '), 'MailMetric');
  assert.equal(getDashboardFirstName('   '), null);
  assert.equal(getDashboardFirstName(null), null);
});

test('calculates rounded percentages without inventing an empty ratio', () => {
  assert.equal(getDashboardPercent(3, 6), 50);
  assert.equal(getDashboardPercent(2, 3), 67);
  assert.equal(getDashboardPercent(0, 0), null);
});

test('formats dashboard dates consistently in UTC', () => {
  assert.equal(
    formatDashboardDate('2026-08-17T23:30:00.000Z'),
    '17 Aug 2026',
  );
});

test('loads the newest six contacts and summary with one token and signal', async () => {
  const controller = new AbortController();
  const calls: Array<{
    type: 'list' | 'summary';
    filters?: ContactFilters;
    page?: number;
    limit?: number;
    token: string;
    signal?: AbortSignal;
  }> = [];
  const source: DashboardDataSource = {
    async list(filters, page, limit, token, signal) {
      calls.push({ type: 'list', filters, page, limit, token, signal });
      return contactsPage;
    },
    async summary(token, signal) {
      calls.push({ type: 'summary', token, signal });
      return summary;
    },
  };

  const result = await loadDashboardOverview(
    'access-token',
    controller.signal,
    source,
  );

  assert.deepEqual(result, { contactsPage, summary });
  assert.equal(calls[0]?.type, 'list');
  assert.equal(calls[0]?.filters?.sort, 'newest');
  assert.equal(calls[0]?.page, 1);
  assert.equal(calls[0]?.limit, 6);
  assert.equal(calls[0]?.token, 'access-token');
  assert.equal(calls[0]?.signal, controller.signal);
  assert.equal(calls[1]?.type, 'summary');
  assert.equal(calls[1]?.token, 'access-token');
  assert.equal(calls[1]?.signal, controller.signal);
});

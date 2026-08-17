'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { clearSession } from '@/redux/features/auth/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import { usePermission } from '@/features/auth/usePermission';
import type { ValidatedContact } from '@/features/valid-contacts/validContacts';
import { ValidContactsApiError } from '@/services/api/validContactsApi';
import {
  formatDashboardDate,
  getDashboardFirstName,
  getDashboardPercent,
  loadDashboardOverview,
  type DashboardOverviewData,
} from './dashboardOverviewModel';
import styles from './DashboardOverview.module.css';

type DashboardState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: DashboardOverviewData };

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'neutral' | 'success' | 'warning' | 'danger' | 'violet';
}) {
  return (
    <article className={styles.metricCard}>
      <span className={`${styles.metricMarker} ${styles[tone]}`} aria-hidden="true" />
      <strong>{value.toLocaleString()}</strong>
      <span>{label}</span>
    </article>
  );
}

function CountBar({
  label,
  value,
  percent,
  tone,
}: {
  label: string;
  value: number;
  percent: number | null;
  tone: 'success' | 'warning' | 'violet' | 'neutral';
}) {
  return (
    <div className={styles.countRow}>
      <div className={styles.countHeading}>
        <span>{label}</span>
        <strong>
          {value.toLocaleString()}
          {percent === null ? '' : ` (${percent}%)`}
        </strong>
      </div>
      <div className={styles.track} aria-hidden="true">
        <span
          className={`${styles.fill} ${styles[tone]}`}
          style={{ width: `${percent ?? 0}%` }}
        />
      </div>
    </div>
  );
}

function ContactStatus({ contact }: { contact: ValidatedContact }) {
  const status = contact.contactStatus === 'sendable'
    ? contact.deliverabilityStatus
    : contact.contactStatus;
  const tone = status === 'deliverable'
    ? styles.statusSuccess
    : status === 'risky'
      ? styles.statusWarning
      : styles.statusDanger;

  return (
    <span className={`${styles.statusBadge} ${tone}`}>
      {status.replaceAll('_', ' ')}
    </span>
  );
}

function DashboardLoading() {
  return (
    <div className={styles.loading} aria-live="polite" aria-busy="true">
      <span className={styles.visuallyHidden}>Loading dashboard data</span>
      <div className={styles.skeletonHeader} />
      <div className={styles.skeletonGrid}>
        {Array.from({ length: 5 }, (_, index) => (
          <div className={styles.skeletonCard} key={index} />
        ))}
      </div>
      <div className={styles.skeletonPanel} />
    </div>
  );
}

export default function DashboardOverview() {
  const { user, token } = usePermission();
  const dispatch = useAppDispatch();
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState<DashboardState>({ status: 'loading' });

  useEffect(() => {
    if (!token) {
      setState({
        status: 'error',
        message: 'Your session has expired. Please sign in again.',
      });
      return;
    }

    const controller = new AbortController();
    setState({ status: 'loading' });

    loadDashboardOverview(token, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ status: 'ready', data });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        if (error instanceof ValidContactsApiError && error.status === 401) {
          dispatch(clearSession());
        }
        setState({
          status: 'error',
          message: error instanceof Error
            ? error.message
            : 'Unable to load dashboard data.',
        });
      });

    return () => controller.abort();
  }, [dispatch, reloadKey, token]);

  const firstName = getDashboardFirstName(user?.name);

  if (state.status === 'loading') return <DashboardLoading />;

  if (state.status === 'error') {
    return (
      <section className={styles.page} aria-label="Dashboard overview">
        <section className={styles.errorPanel} role="alert">
          <span className={styles.errorIcon} aria-hidden="true">!</span>
          <div>
            <h1>Dashboard data is unavailable</h1>
            <p>{state.message}</p>
          </div>
          <button type="button" onClick={() => setReloadKey((value) => value + 1)}>
            Retry
          </button>
        </section>
      </section>
    );
  }

  const { contactsPage, summary } = state.data;
  const classifiedTotal = summary.deliverable + summary.risky;
  const deliverablePercent = getDashboardPercent(
    summary.deliverable,
    classifiedTotal,
  );
  const riskyPercent = getDashboardPercent(summary.risky, classifiedTotal);
  const sentPercent = getDashboardPercent(summary.sent, contactsPage.total);
  const neverSentPercent = getDashboardPercent(
    summary.neverSent,
    contactsPage.total,
  );

  return (
    <section className={styles.page} aria-label="Dashboard overview">
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Workspace overview</p>
          <h1>Welcome back{firstName ? `, ${firstName}` : ''}</h1>
          <p>Review your saved contacts and continue validating with real account data.</p>
        </div>
        <nav className={styles.actions} aria-label="Dashboard actions">
          <Link className={styles.secondaryAction} href="/dashboard/valid-emails">
            Valid Emails
          </Link>
          <Link className={styles.secondaryAction} href="/dashboard/validation/bulk">
            Bulk Validation
          </Link>
          <Link className={styles.primaryAction} href="/dashboard/validation/single">
            Validate Email
          </Link>
        </nav>
      </header>

      <section className={styles.metricGrid} aria-label="Contact summary">
        <MetricCard label="Total saved contacts" value={contactsPage.total} tone="neutral" />
        <MetricCard label="Deliverable" value={summary.deliverable} tone="success" />
        <MetricCard label="Risky" value={summary.risky} tone="warning" />
        <MetricCard label="Suppressed" value={summary.suppressed} tone="danger" />
        <MetricCard label="Previously contacted" value={summary.sent} tone="violet" />
      </section>

      <section className={styles.distributionGrid}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Deliverability</h2>
              <p>Saved contacts grouped by current validation evidence.</p>
            </div>
          </div>
          {classifiedTotal === 0 ? (
            <p className={styles.emptyCopy}>No classified contacts yet.</p>
          ) : (
            <div className={styles.countList}>
              <CountBar
                label="Deliverable"
                value={summary.deliverable}
                percent={deliverablePercent}
                tone="success"
              />
              <CountBar
                label="Risky"
                value={summary.risky}
                percent={riskyPercent}
                tone="warning"
              />
            </div>
          )}
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Sending readiness</h2>
              <p>Independent activity counts across your saved contacts.</p>
            </div>
          </div>
          {contactsPage.total === 0 ? (
            <p className={styles.emptyCopy}>No sending activity yet.</p>
          ) : (
            <div className={styles.countList}>
              <CountBar
                label="Previously contacted"
                value={summary.sent}
                percent={sentPercent}
                tone="violet"
              />
              <CountBar
                label="Never sent"
                value={summary.neverSent}
                percent={neverSentPercent}
                tone="neutral"
              />
            </div>
          )}
        </article>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2>Recent contacts</h2>
            <p>The six newest contacts saved from single or bulk validation.</p>
          </div>
          <Link className={styles.textLink} href="/dashboard/valid-emails">
            View all
          </Link>
        </div>

        {contactsPage.contacts.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No saved contacts yet</h3>
            <p>Validate an email to start building your contact workspace.</p>
            <Link className={styles.primaryAction} href="/dashboard/validation/single">
              Validate your first email
            </Link>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Quality score</th>
                  <th>Source</th>
                  <th>Last validated</th>
                </tr>
              </thead>
              <tbody>
                {contactsPage.contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td data-label="Email" className={styles.emailCell}>{contact.email}</td>
                    <td data-label="Status"><ContactStatus contact={contact} /></td>
                    <td data-label="Quality score">Quality score {contact.score}/100</td>
                    <td data-label="Source">
                      {contact.source === 'single' ? 'Single validation' : 'Bulk validation'}
                    </td>
                    <td data-label="Last validated">{formatDashboardDate(contact.lastValidatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}

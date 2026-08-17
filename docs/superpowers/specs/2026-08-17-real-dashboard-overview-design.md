# Real Dashboard Overview Design

## Goal

Replace the `/dashboard` page's demo identity, invented metrics, fake charts, and sample activity with an honest overview backed only by APIs that already exist. This is a frontend MVP: it does not add historical analytics or change backend contracts.

## Scope

The dashboard will use the authenticated user, `GET /valid-contacts/summary`, and `GET /valid-contacts?sort=newest&page=1&limit=6`.

It will show:

- the authenticated user's name;
- total saved contacts from the list pagination total;
- deliverable, risky, suppressed, and previously contacted counts;
- deliverable-versus-risky distribution;
- contacted-versus-never-sent readiness;
- the six newest saved contacts with email, deliverability status, score, source, and last-validation time;
- links to Single Validation, Bulk Validation, and Valid Emails.

The dashboard will remove:

- the hard-coded `John` identity;
- invented totals, percentages, growth indicators, and dates;
- fake API traffic and weekly trend charts;
- sample email addresses and activity rows.

Historical validation totals, time-series trends, API-traffic analytics, and comparisons with previous periods remain out of scope until the backend exposes authoritative analytics endpoints.

## Data Semantics

The dashboard must not combine overlapping summary values into a false total.

- `total saved contacts` comes from valid-contact list pagination.
- `deliverable` and `risky` are mutually exclusive deliverability groups and may be compared as a distribution.
- `suppressed` is a contact-state count and may overlap a deliverability group, so it remains a separate KPI.
- `sent` and `neverSent` describe sending activity and remain separate from deliverability.
- A saved contact is not proof of ownership or inbox delivery.

All labels must use the existing product vocabulary. Scores are rendered as points out of 100, not percentages.

## Frontend Architecture

Create a focused dashboard feature boundary rather than keeping the current large inline page.

- `DashboardOverview` owns loading, success, empty, and failure presentation.
- A small dashboard data module loads the summary and recent contacts in parallel using the existing valid-contacts API service.
- `/dashboard/page.tsx` becomes a thin route wrapper.
- `usePermission()` supplies the authenticated user and access token.
- Existing API parsing remains centralized in `validContactsApi.ts`; the dashboard does not parse raw envelopes itself.
- Existing shared dashboard layout, navigation, authentication, and unrelated working-tree changes remain untouched.

The dashboard may compute display-only percentages from authoritative counts. It must not fabricate missing dates, comparisons, or trends.

## Page Composition

### Header

Show `Welcome back, {first name}` when a user name is available and a neutral `Welcome back` fallback otherwise. Keep the primary Single Validation action and add compact links for Bulk Validation and Valid Emails.

### KPI cards

Render five real cards:

1. Total saved contacts
2. Deliverable
3. Risky
4. Suppressed
5. Previously contacted

When a value is zero, render `0`; never replace it with demo data.

### Real distributions

Show two simple count-based panels without time axes:

- Deliverable versus Risky
- Previously contacted versus Never sent

If the relevant denominator is zero, show an empty-state message rather than a percentage.

### Recent contacts

Render up to six newest contacts. Each row shows email, deliverability status, score, validation source, and formatted last-validation time. The section links to the full Valid Emails workspace.

## Loading, Empty, and Error States

- Show stable loading placeholders while both requests are pending.
- If both requests succeed with no contacts, show zero-valued cards and a clear empty state with a link to Single Validation.
- If either request fails, do not display partial data as a complete dashboard. Show an inline error with Retry.
- Abort in-flight requests when the component unmounts or reloads.
- Preserve the existing authentication behavior for missing or expired credentials.

## Accessibility and Responsive Behavior

- Keep semantic headings and accessible links/buttons.
- Status information must use text as well as color.
- Loading and error messages must be announced appropriately.
- Cards and tables must collapse cleanly at existing dashboard breakpoints; recent-contact rows may become stacked cards on narrow screens.

## Verification

- Unit-test derived display values, zero denominators, and date/score formatting.
- Source/UI-test the absence of known demo values and sample addresses.
- Test loading, empty, success, error, and Retry behavior with mocked API responses.
- Verify authenticated identity and both API requests.
- Run focused dashboard tests, the complete frontend test suite, TypeScript checking, and a production build.
- Manually confirm the deployed dashboard calls the VPS API and displays database-backed values.

## Deferred Work

A later backend analytics feature may add historical validation totals, daily status buckets, API traffic, comparison periods, and trend charts. Those features require explicit server-side aggregation and a separate design; they must not be approximated from a single paginated contacts response.

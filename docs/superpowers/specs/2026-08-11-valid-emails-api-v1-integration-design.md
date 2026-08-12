# Valid Emails API v1 Integration Design

**Date:** 2026-08-11
**Status:** Approved for implementation planning

## Context

The Valid Emails page already has the intended layout, filtering controls, explicit and select-all selection behavior, and email composer. It currently reads mock contacts and simulates sending. The backend already has persisted valid-contact and email-send modules, but the deployed API still uses unversioned `/api/...` routes and Swagger is available at `/api/docs`.

This change connects the existing page to the real backend and establishes one versioned API contract for the whole frontend.

## Goals

- Serve backend routes from `/api/v1`.
- Publish Swagger at `/api/v1/docs`.
- Load valid contacts and their summary from the database.
- Preserve server-side search, filters, sorting, and pagination.
- Support selecting one, several, or all matching contacts.
- Send one email to each selected recipient through the server-configured SMTP mailbox.
- Give the user accurate loading, success, partial-failure, and error feedback.

## Non-goals

- Receiving or displaying email replies inside this application.
- Per-user SMTP accounts or sender selection.
- Rich-text templates, scheduling, campaigns, or attachments.
- Keeping the old unversioned API routes after the coordinated frontend migration.
- Redesigning the already-approved Valid Emails page.

## Backend API Versioning

NestJS will use URI versioning with version `1` as the default and `api` as the global prefix. Application endpoints therefore use `/api/v1/<resource>`.

Required public routes:

- `GET /api/v1/health`
- `GET /api/v1/docs`

Swagger setup must run in production as well as development. Swagger remains public so developers can inspect the contract, but trying protected operations still requires a JWT bearer token. The document will expose bearer authentication and clear `Valid Contacts` and `Email Sends` tags.

Protected application routes include:

- `GET /api/v1/valid-contacts`
- `GET /api/v1/valid-contacts/summary`
- `POST /api/v1/email-sends`

The coordinated release removes reliance on old `/api/...` endpoints. The frontend and backend must be deployed together or the backend must be deployed immediately before the frontend.

## Frontend API Base Convention

`NEXT_PUBLIC_API_BASE_URL` represents the complete versioned API root rather than only the backend origin.

- Production: `https://ilmify-mail-metrics-backend.vercel.app/api/v1`
- Local development: `http://localhost:4000/api/v1`
- Empty value: use `/api/v1` so the existing Next.js `/api/:path*` proxy can forward local requests.

Frontend service methods use resource-relative paths such as `/auth/login`, `/validation/single`, `/valid-contacts`, and `/email-sends`. Existing authentication and validation services must be migrated in the same change so they do not continue adding a second `/api` segment.

## Valid Contacts Contract

### List request

`GET /valid-contacts` accepts:

- `search`
- `validationStatus`: `valid` or `risky`
- `source`: `single` or `bulk`
- `activity`: `never_sent`, `sent`, or `failed`
- `dateFrom` and `dateTo`
- `sort`: `newest`, `oldest`, `highest_score`, or `lowest_score`
- `page`
- `limit`

The Valid Emails page sends its filters to the server. It does not download the full contact collection and filter it in the browser.

The backend interceptor wraps the paginated result. The frontend API adapter unwraps it, validates the expected shape, and returns:

```ts
{
  contacts: ValidContact[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  sendableTotal: number;
}
```

`total` counts all matching rows shown by the contact list, including suppressed
contacts. `sendableTotal` counts matching contacts whose `contactStatus` is
`sendable`; select-all uses this value so its displayed count and 25-recipient
limit remain accurate even when suppressed contacts exist on another page.

Mapping rules:

- backend `_id` becomes frontend `id`
- backend `lastSendStatus: "accepted"` becomes UI status `sent`
- backend `lastSendStatus: "failed"` remains `failed`
- missing send status becomes `never_sent`

### Summary request

`GET /valid-contacts/summary` returns persisted totals for `valid`, `risky`, `suppressed`, `sent`, and `neverSent`. The page loads the list and summary in parallel and refreshes both after a send.

## Selection and Pagination

Two selection modes are retained:

1. **Explicit selection:** the user selects individual contact IDs, including one or several visible contacts.
2. **All matching:** the user selects every contact matching the current server-side filters and can exclude individual IDs.

Changing a filter clears selection because the meaning of “all matching” has changed. Moving between pages preserves explicit selections. The UI displays the selected count and enforces the backend maximum of 25 recipients before submission.

The backend repeats the 25-recipient enforcement. Frontend limits are convenience only, not a security boundary.

## Email Send Contract

`POST /email-sends` includes:

```ts
{
  clientRequestId: string;
  subject: string;
  message: string;
  contactIds?: string[];
  allMatching?: {
    search?: string;
    validationStatus?: "valid" | "risky";
    source?: "single" | "bulk";
    activity?: "never_sent" | "sent" | "failed";
    dateFrom?: string;
    dateTo?: string;
    excludedIds?: string[];
  };
}
```

`clientRequestId` is generated with `crypto.randomUUID()` for idempotency. Exactly one recipient source is sent: `contactIds` for explicit selection or `allMatching` for select-all.

The sender is the single SMTP account configured on the backend. The frontend does not accept or transmit SMTP credentials and does not provide a user-editable `from` address. The UI labels it as **Configured SMTP mailbox**, not as a Titan-specific mailbox.

Each recipient receives a separate email. The response reports accepted and failed counts. After completion the page refreshes contacts and summary so last-send state comes from persisted backend data rather than an optimistic update.

## Component and Data Flow

The current workspace remains the main UI component. A dedicated valid-contacts API module owns URL construction, bearer headers, response unwrapping, query serialization, and domain mapping. Pure selection/filter-to-payload helpers stay separately testable.

On page entry:

1. Read the access token from Redux auth state.
2. Request the current contact page and summary in parallel.
3. Render mapped server data.
4. Refetch the list when debounced filters, sorting, or pagination change.
5. Abort stale list requests so a slower previous filter cannot overwrite newer results.

On send:

1. Validate recipients, subject, and message.
2. Build an explicit or all-matching payload.
3. Disable the send action for the complete request lifecycle.
4. Show accepted and failed totals from the response.
5. Refresh list and summary and clear successful selection state.

## UI and Error States

The page must distinguish:

- initial loading
- refreshing after filters change
- no contacts in the account
- no matches for current filters
- expired or missing authentication
- recoverable API failure with retry
- email sending in progress
- full send success
- partial delivery failure
- complete send failure

The mock-data badge, mock-data import, and simulated timeout are removed. No optimistic `sent` state is shown. An unauthorized response follows the existing authentication/session handling rather than being presented as an empty list.

## Security and Operational Rules

- Contact and email-send endpoints require JWT bearer authentication.
- Swagger is public, but protected endpoint execution requires authorization.
- SMTP configuration exists only in backend environment variables.
- API responses and logs must not reveal SMTP credentials.
- Backend ownership filters ensure users can only view and send to their own saved contacts.
- Subject, message, selection shape, exclusions, and recipient limits are validated server-side.
- A real delivery verification is an external side effect and requires an explicitly approved recipient address.

## Testing and Verification

Backend verification covers:

- `/api/v1/probe` or equivalent test route resolves
- old `/api/probe` returns `404`
- Swagger is configured at `/api/v1/docs`
- protected valid-contact and email-send routes reject unauthenticated requests
- DTO and controller/service behavior for list filters and both selection modes
- unit tests, lint, end-to-end tests where configured, and production build

Frontend verification covers:

- API-envelope parsing and contact mapping
- list query generation
- explicit-selection payload creation
- all-matching payload creation with exclusions
- authentication and API error handling
- existing selection helper behavior
- tests, type checking/lint, and production build

After deployment, verify independently:

- `GET https://ilmify-mail-metrics-backend.vercel.app/api/v1/health` returns `200`
- `GET https://ilmify-mail-metrics-backend.vercel.app/api/v1/docs` serves Swagger
- unauthenticated `GET /api/v1/valid-contacts` returns `401`
- an authenticated Valid Emails page loads persisted contacts and summary

A real send is not part of automated or deployment smoke tests unless the user explicitly supplies and approves a test recipient.

## Change Isolation

The backend currently has separate unintegrated role-cleanup work and both repositories contain unrelated working-tree changes. Implementation must use a dedicated API-integration branch or begin only after the role-cleanup branch is integrated. Commits will stage only files belonging to this feature and will preserve unrelated modifications.

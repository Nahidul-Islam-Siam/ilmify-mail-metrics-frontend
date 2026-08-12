# Valid Emails API v1 Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the NestJS API and Swagger under `/api/v1`, then replace the Valid Emails mock workflow with authenticated persisted contact listing and SMTP email sending.

**Architecture:** NestJS URI versioning provides the canonical API root while the existing response interceptor continues to shape responses. The frontend treats `NEXT_PUBLIC_API_BASE_URL` as that complete versioned root, uses a focused API adapter for validation and mapping, and keeps selection/composer logic pure and testable. The existing Valid Emails layout remains; only its data source and async states change.

**Tech Stack:** NestJS 10, TypeScript, Jest, Supertest, Swagger, MongoDB/Mongoose, Next.js 14, React 18, Redux Toolkit, Node test runner/tsx, CSS Modules.

## Global Constraints

- Canonical production API root: `https://ilmify-mail-metrics-backend.vercel.app/api/v1`.
- Public Swagger route: `https://ilmify-mail-metrics-backend.vercel.app/api/v1/docs`.
- Old unversioned `/api/...` application routes are not retained.
- Valid-contact and email-send endpoints remain JWT protected and owner scoped.
- The backend SMTP account is the only sender; no SMTP secret or editable `from` value enters frontend state.
- Each recipient receives a separate email; maximum 25 recipients per request in both frontend and backend.
- A real email-send smoke test requires an explicitly approved recipient address.
- Do not use a worktree; preserve unrelated working-tree and line-ending changes and stage only named files.
- Backend work must start on a dedicated `feature/valid-emails-api-v1` branch based on the currently approved backend history. The current role-cleanup commits must be integrated first or intentionally included as the branch base; do not silently drop them.
- Frontend work continues on `feature/email-send`, which already contains the approved page and design spec.

---

## File Structure

### Backend

- `src/main.ts` — URI versioning, CORS, public Swagger setup, and Vercel/bootstrap application creation.
- `src/main.spec.ts` — focused route-versioning and Swagger-path contract tests.
- `src/valid-contacts/valid-contacts.repository.ts` — paged contact query and matching sendable count.
- `src/valid-contacts/valid-contacts.service.ts` — stable `{ data, pagination }` envelope and all-matching recipient resolution.
- `src/valid-contacts/valid-contacts.controller.ts` — JWT and Swagger metadata for valid-contact endpoints.
- `src/valid-contacts/valid-contacts.repository.spec.ts` — sendable-total query behavior.
- `src/valid-contacts/valid-contacts.service.spec.ts` — pagination contract and all-status selection behavior.
- `src/email-sends/email-sends.controller.ts` — JWT and Swagger metadata for send endpoints.
- `src/email-sends/email-sends.controller.spec.ts` — Swagger/JWT metadata regression checks.
- `test/mailmetric.e2e-spec.ts` — versioned health, validation, contacts, sending, and legacy-route HTTP contract.

### Frontend

- `.env.example` — local versioned public API root.
- `services/api/apiUrl.ts` — full versioned-root URL joining and `/api/v1` same-origin fallback.
- `services/api/apiUrl.test.ts` — URL contract.
- `services/api/authApi.ts` / `authApi.test.ts` — resource-relative auth calls and request URL assertions.
- `services/api/validationApi.ts` / `validationApi.test.ts` — resource-relative validation calls and request URL assertions.
- `services/api/validContactsApi.ts` — valid-contact list/summary/send HTTP adapter and runtime response parsing.
- `services/api/validContactsApi.test.ts` — query, mapping, envelope, payload, and error tests.
- `features/valid-contacts/validContacts.ts` — domain types and pure selection/send-payload helpers; no mock collection.
- `features/valid-contacts/validContacts.test.ts` — explicit/all-matching payload and selection tests.
- `features/valid-contacts/ValidContactsWorkspace.tsx` — authenticated server data, abortable fetching, paging, sending, and UI states.
- `features/valid-contacts/ValidContactsWorkspace.module.css` — loading, retry, refresh, and feedback styles using the current design tokens.
- `docs/superpowers/specs/2026-08-11-valid-emails-api-v1-integration-design.md` — approved contract, including accurate `sendableTotal` semantics.

---

### Task 1: Version and Document the NestJS HTTP Application

**Files:**

- Modify: `backend/src/main.ts`
- Modify: `backend/src/main.spec.ts`

**Interfaces:**

- Produces: `configureHttpApp(app, configService): void` enabling URI version `1` below global prefix `api`.
- Produces: `configureSwagger(app): void` exposing Swagger UI at `api/v1/docs` in every environment.
- Consumes: existing `createApplication()` bootstrap and Vercel handler.

- [ ] **Preparation: create the backend feature branch without a worktree**

The approved role cleanup is the current backend HEAD, so intentionally stack
this feature on it and give the combined work a feature branch name:

```bash
git -C backend branch --show-current
git -C backend switch -c feature/valid-emails-api-v1
```

Expected: the first command reports `chore/remove-unused-auth-role-constants`;
the second creates `feature/valid-emails-api-v1` without altering working files.
If the branch already exists, switch to it rather than creating another branch.

- [ ] **Step 1: Write failing versioning and Swagger tests**

Replace the unversioned route assertion in `src/main.spec.ts` and import `configureSwagger`:

```ts
import vercelHandler, {
  configureDnsServers,
  configureHttpApp,
  configureSwagger,
} from './main';

it('serves default-version routes below /api/v1 only', async () => {
  const moduleRef = await Test.createTestingModule({
    controllers: [ProbeController],
  }).compile();
  const app = moduleRef.createNestApplication();
  const config = new ConfigService({
    CORS_ORIGINS: 'http://localhost:3000',
  });

  configureHttpApp(app, config);
  await app.init();

  await request(app.getHttpServer())
    .get('/api/v1/probe')
    .set('Origin', 'http://localhost:3000')
    .expect('Access-Control-Allow-Origin', 'http://localhost:3000')
    .expect(200, { ok: true });
  await request(app.getHttpServer()).get('/api/probe').expect(404);
  await app.close();
});

it('publishes Swagger below the versioned API root', async () => {
  const moduleRef = await Test.createTestingModule({
    controllers: [ProbeController],
  }).compile();
  const app = moduleRef.createNestApplication();
  configureHttpApp(app, new ConfigService());
  configureSwagger(app);
  await app.init();

  await request(app.getHttpServer()).get('/api/v1/docs').expect(200);
  await request(app.getHttpServer()).get('/api/docs').expect(404);
  await app.close();
});
```

- [ ] **Step 2: Run the focused test and confirm the old behavior fails**

Run: `cd backend && pnpm exec jest src/main.spec.ts --runInBand`

Expected: FAIL because `/api/v1/probe` and `/api/v1/docs` do not exist while `/api/probe` still resolves.

- [ ] **Step 3: Add URI versioning and unconditional Swagger setup**

Update imports and application configuration in `src/main.ts`:

```ts
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';

export function configureHttpApp(
  app: INestApplication,
  configService: ConfigService,
): void {
  // Existing CORS origin parsing stays unchanged.
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.enableCors({ origin: origins, credentials: true });
  // Existing global ValidationPipe stays unchanged.
}

export function configureSwagger(app: INestApplication): void {
  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('MailMetric API')
    .setDescription('Email validation and mail metrics API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1/docs', app, document);
}
```

Delete the `NODE_ENV !== 'production'` guard and call `configureSwagger(app)` from `createApplication()` after global HTTP configuration/interceptors are registered.

- [ ] **Step 4: Run the focused test**

Run: `cd backend && pnpm exec jest src/main.spec.ts --runInBand`

Expected: all `src/main.spec.ts` tests PASS; `/api/probe` and `/api/docs` return `404`.

- [ ] **Step 5: Commit the backend versioning slice**

```bash
git -C backend add src/main.ts src/main.spec.ts
git -C backend commit -m "feat: version API and publish Swagger"
```

---

### Task 2: Return Accurate Contact Pagination and Selection Counts

**Files:**

- Modify: `backend/src/valid-contacts/valid-contacts.repository.ts`
- Modify: `backend/src/valid-contacts/valid-contacts.repository.spec.ts`
- Modify: `backend/src/valid-contacts/valid-contacts.service.ts`
- Modify: `backend/src/valid-contacts/valid-contacts.service.spec.ts`

**Interfaces:**

- Produces: repository `list(...) => Promise<{ data: ValidatedContactRecord[]; total: number; sendableTotal: number }>`.
- Produces: service `list(...) => { data, pagination: IPagination & { sendableTotal: number } }`.
- Produces: `resolveSendRecipients()` with no implicit `valid` filter when all statuses were selected.
- Consumes: `pagination(limit, page, total)` from `src/common/pagination/pagination.ts`.

- [ ] **Step 1: Add failing repository tests for total and sendable total**

Extend `valid-contacts.repository.spec.ts` so the list test supplies two count results and asserts the second query adds `contactStatus: 'sendable'`:

```ts
it('counts all matching rows and matching sendable recipients separately', async () => {
  model.countDocuments
    .mockReturnValueOnce({ exec: jest.fn().mockResolvedValue(7) } as never)
    .mockReturnValueOnce({ exec: jest.fn().mockResolvedValue(5) } as never);

  const result = await repository.list({
    ownerId: 'owner-1',
    filter: { validationStatus: 'valid' },
    sort: 'newest',
    page: 1,
    limit: 20,
  });

  expect(result).toMatchObject({ total: 7, sendableTotal: 5 });
  expect(model.countDocuments).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      ownerId: 'owner-1',
      validationStatus: 'valid',
      contactStatus: 'sendable',
    }),
  );
});
```

- [ ] **Step 2: Add failing service tests for pagination and all-status selection**

Add to `valid-contacts.service.spec.ts`:

```ts
it('returns interceptor-compatible pagination with sendableTotal', async () => {
  repository.list.mockResolvedValue({
    data: [],
    total: 7,
    sendableTotal: 5,
  });

  await expect(service.list('owner-1', {
    validationStatus: 'valid',
    sort: 'newest',
    page: 1,
    limit: 20,
  })).resolves.toEqual({
    data: [],
    pagination: {
      currentPage: 1,
      totalItems: 7,
      totalPages: 1,
      nextPage: null,
      previousPage: null,
      itemsPerPage: 20,
      sendableTotal: 5,
    },
  });
});

it('does not force valid-only recipients when all statuses are selected', async () => {
  repository.findSendableMatching.mockResolvedValue([]);
  await service.resolveSendRecipients('owner-1', { allMatching: {} });
  expect(repository.findSendableMatching).toHaveBeenCalledWith(
    'owner-1',
    expect.objectContaining({ validationStatus: undefined }),
    [],
    26,
  );
});
```

Replace the existing pagination expectation with the first assertion above,
while retaining its inverted-date-range rejection. Add
`findSendableMatching: jest.fn()` to the repository mock in `beforeEach` before
using it in the all-status test.

- [ ] **Step 3: Run both test files and verify failure**

Run: `cd backend && pnpm exec jest src/valid-contacts/valid-contacts.repository.spec.ts src/valid-contacts/valid-contacts.service.spec.ts --runInBand`

Expected: FAIL because `sendableTotal` and the pagination envelope are absent and all-matching currently defaults to `valid`.

- [ ] **Step 4: Implement the repository and service contracts**

In the repository, count all and sendable matches in the same `Promise.all`:

```ts
async list(input: {
  ownerId: string;
  filter: ValidContactFilter;
  sort: ContactSort;
  page: number;
  limit: number;
}): Promise<{
  data: ValidatedContactRecord[];
  total: number;
  sendableTotal: number;
}> {
  const filter = this.buildFilter(input.ownerId, input.filter);
  const sort = this.buildSort(input.sort);
  const [data, total, sendableTotal] = await Promise.all([
    this.model.find(filter).sort(sort)
      .skip((input.page - 1) * input.limit)
      .limit(input.limit).lean<ValidatedContactRecord[]>().exec(),
    this.model.countDocuments(filter).exec(),
    this.model.countDocuments({ ...filter, contactStatus: 'sendable' }).exec(),
  ]);
  return { data, total, sendableTotal };
}
```

In the service, use the established pagination envelope:

```ts
import { pagination } from '../common/pagination/pagination';

return {
  data: result.data,
  pagination: {
    ...pagination(input.limit, input.page, result.total),
    sendableTotal: result.sendableTotal,
  },
};
```

In `resolveSendRecipients`, change the selection filter from `input.validationStatus ?? 'valid'` to:

```ts
validationStatus: input.validationStatus,
```

- [ ] **Step 5: Run both focused suites**

Run: `cd backend && pnpm exec jest src/valid-contacts/valid-contacts.repository.spec.ts src/valid-contacts/valid-contacts.service.spec.ts --runInBand`

Expected: both suites PASS.

- [ ] **Step 6: Commit accurate contact pagination**

```bash
git -C backend add src/valid-contacts/valid-contacts.repository.ts src/valid-contacts/valid-contacts.repository.spec.ts src/valid-contacts/valid-contacts.service.ts src/valid-contacts/valid-contacts.service.spec.ts
git -C backend commit -m "fix: expose sendable contact totals"
```

---

### Task 3: Add Swagger Metadata and Versioned End-to-End Contracts

**Files:**

- Modify: `backend/src/valid-contacts/valid-contacts.controller.ts`
- Modify: `backend/src/valid-contacts/valid-contacts.controller.spec.ts`
- Modify: `backend/src/email-sends/email-sends.controller.ts`
- Modify: `backend/src/email-sends/email-sends.controller.spec.ts`
- Modify: `backend/test/mailmetric.e2e-spec.ts`

**Interfaces:**

- Produces: Swagger tags `Valid Contacts` and `Email Sends` with bearer-auth requirements.
- Consumes: versioned routing from Task 1 and pagination response from Task 2.

- [ ] **Step 1: Add failing Swagger metadata assertions**

Import Swagger metadata constants and assert tags/security in both controller specs:

```ts
import { DECORATORS } from '@nestjs/swagger/dist/constants';

expect(Reflect.getMetadata(DECORATORS.API_TAGS, ValidContactsController))
  .toContain('Valid Contacts');
expect(Reflect.getMetadata(DECORATORS.API_SECURITY, ValidContactsController))
  .toEqual(expect.arrayContaining([{ bearer: [] }]));
```

Use `EmailSendsController` and `Email Sends` in its corresponding test.

- [ ] **Step 2: Run controller tests to verify metadata is missing**

Run: `cd backend && pnpm exec jest src/valid-contacts/valid-contacts.controller.spec.ts src/email-sends/email-sends.controller.spec.ts --runInBand`

Expected: FAIL on missing Swagger tags/security metadata.

- [ ] **Step 3: Apply controller Swagger decorators**

Add to each controller:

```ts
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Valid Contacts') // Use 'Email Sends' in EmailSendsController.
@ApiBearerAuth()
@Controller('valid-contacts') // Keep each controller's current path.
@UseGuards(JwtAuthGuard)
```

- [ ] **Step 4: Convert e2e paths and expected contact envelope**

Change every HTTP endpoint in `test/mailmetric.e2e-spec.ts` from `/api/...` to `/api/v1/...`. Change `contactsResult` to:

```ts
const contactsResult = {
  data: [
    {
      _id: '66b76d0f59ac07e820160001',
      email: 'person@example.com',
      validationStatus: 'valid',
      contactStatus: 'sendable',
    },
  ],
  pagination: {
    currentPage: 1,
    totalItems: 1,
    totalPages: 1,
    nextPage: null,
    previousPage: null,
    itemsPerPage: 20,
    sendableTotal: 1,
  },
};
```

Make the mocked service return this object. Add a legacy-route rejection test:

```ts
it('does not expose the legacy unversioned health route', async () => {
  await request(app.getHttpServer()).get('/api/health').expect(404);
});
```

Keep validation boundary tests, owner forwarding, explicit send payload, email-send detail, and disabled Google integration assertions; only version their paths.

Add a separate protected-route app inside the e2e test and make its guard throw
the same exception used for a missing bearer session:

```ts
it('rejects unauthenticated valid-contact requests', async () => {
  const moduleRef = await Test.createTestingModule({
    controllers: [ValidContactsController],
    providers: [{ provide: ValidContactsService, useValue: validContacts }],
  })
    .overrideGuard(JwtAuthGuard)
    .useValue({
      canActivate: () => {
        throw new UnauthorizedException();
      },
    })
    .compile();
  const protectedApp = moduleRef.createNestApplication();
  configureHttpApp(protectedApp, new ConfigService());
  await protectedApp.init();

  await request(protectedApp.getHttpServer())
    .get('/api/v1/valid-contacts')
    .expect(401);
  await protectedApp.close();
});
```

Add `UnauthorizedException` to the existing `@nestjs/common` import.

- [ ] **Step 5: Run controller and HTTP contract tests**

Run: `cd backend && pnpm exec jest src/valid-contacts/valid-contacts.controller.spec.ts src/email-sends/email-sends.controller.spec.ts --runInBand && pnpm test:e2e`

Expected: all focused controller suites and `mailmetric.e2e-spec.ts` PASS.

- [ ] **Step 6: Commit the documented HTTP contract**

```bash
git -C backend add src/valid-contacts/valid-contacts.controller.ts src/valid-contacts/valid-contacts.controller.spec.ts src/email-sends/email-sends.controller.ts src/email-sends/email-sends.controller.spec.ts test/mailmetric.e2e-spec.ts
git -C backend commit -m "test: cover versioned contacts and email APIs"
```

---

### Task 4: Migrate Every Frontend Service to the Versioned API Root

**Files:**

- Modify: `frontend/.env.example`
- Modify: `frontend/services/api/apiUrl.ts`
- Modify: `frontend/services/api/apiUrl.test.ts`
- Modify: `frontend/services/api/authApi.ts`
- Modify: `frontend/services/api/authApi.test.ts`
- Modify: `frontend/services/api/validationApi.ts`
- Modify: `frontend/services/api/validationApi.test.ts`

**Interfaces:**

- Produces: `buildApiUrl(resourcePath, baseUrl?)` joining a full API root and a resource-relative path.
- Consumes: production/local base ending in `/api/v1`.

- [ ] **Step 1: Replace URL tests with the versioned-root contract**

Use these assertions in `apiUrl.test.ts`:

```ts
test('joins a full versioned API root with a resource path', () => {
  assert.equal(
    buildApiUrl('/auth/login', 'http://localhost:4000/api/v1/'),
    'http://localhost:4000/api/v1/auth/login',
  );
});

test('falls back to same-origin /api/v1', () => {
  assert.equal(buildApiUrl('/auth/login', ''), '/api/v1/auth/login');
});

test('normalizes missing and duplicate slashes', () => {
  assert.equal(
    buildApiUrl('validation/single', 'https://api.example.com/api/v1///'),
    'https://api.example.com/api/v1/validation/single',
  );
});
```

Add fetch-spy tests to `authApi.test.ts` and `validationApi.test.ts` that call one exported request function and assert URLs are resource-relative through `buildApiUrl`, not hard-coded `/api/...`.

- [ ] **Step 2: Run API tests and confirm the old join contract fails**

Run: `cd frontend && npx tsx --test services/api/apiUrl.test.ts services/api/authApi.test.ts services/api/validationApi.test.ts`

Expected: URL tests FAIL because the current functions still include `/api` in every resource path.

- [ ] **Step 3: Implement the normalized API-root join**

Replace `apiUrl.ts` with:

```ts
const PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

export function buildApiUrl(
  path: string,
  baseUrl = PUBLIC_API_BASE_URL,
): string {
  const normalizedBase = (baseUrl || '/api/v1').replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '');
  return `${normalizedBase}/${normalizedPath}`;
}
```

Change auth calls to `/auth/login`, `/auth/me`, `/auth/refresh-token`, and `/auth/logout`. Change validation calls to `/validation/single` and `/validation/bulk`.

Update `.env.example`:

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
API_PROXY_TARGET=http://localhost:4000
```

Do not change the Next rewrite: `/api/:path*` already forwards `/api/v1/...` correctly when the public base is empty.

- [ ] **Step 4: Run all existing frontend API tests**

Run: `cd frontend && npx tsx --test services/api/apiUrl.test.ts services/api/authApi.test.ts services/api/validationApi.test.ts`

Expected: all selected tests PASS and fetch spies show versioned URLs.

- [ ] **Step 5: Commit the frontend API-root migration**

```bash
git -C frontend add .env.example services/api/apiUrl.ts services/api/apiUrl.test.ts services/api/authApi.ts services/api/authApi.test.ts services/api/validationApi.ts services/api/validationApi.test.ts
git -C frontend commit -m "refactor: use versioned API root"
```

---

### Task 5: Build the Valid Contacts HTTP Adapter

**Files:**

- Create: `frontend/services/api/validContactsApi.ts`
- Create: `frontend/services/api/validContactsApi.test.ts`
- Modify: `frontend/features/valid-contacts/validContacts.ts`

**Interfaces:**

- Produces: `listValidContacts(filters, page, limit, accessToken, signal?) => Promise<ValidContactsPage>`.
- Produces: `getValidContactsSummary(accessToken, signal?) => Promise<ValidContactsSummary>`.
- Produces: `sendContactEmail(input, accessToken) => Promise<EmailSendResult>`.
- Produces: `ValidContactsApiError` with numeric `status`.
- Consumes: `ValidatedContact`, `ContactFilters`, and `SendEmailInput` domain types.

- [ ] **Step 1: Define domain result and payload types alongside the existing preview data**

Keep the existing status/filter/selection types in `validContacts.ts` and add the following types. Leave `CONTACT_SEEDS`, `MOCK_VALID_CONTACTS`, and `filterContacts` temporarily so this API-foundation commit remains independently type-safe; Task 7 removes them when the component stops importing them.

```ts
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
```

- [ ] **Step 2: Write failing adapter tests**

Create `validContactsApi.test.ts` with concrete assertions for:

```ts
test('serializes server filters and omits all-valued filters', () => {
  assert.equal(buildValidContactsQuery({
    ...DEFAULT_FILTERS,
    search: ' acme ',
    validationStatus: 'all',
    source: 'bulk',
    activity: 'never_sent',
  }, 2, 20), 'search=acme&source=bulk&activity=never_sent&sort=newest&page=2&limit=20');
});

test('maps the intercepted list envelope and accepted send state', () => {
  assert.deepEqual(parseValidContactsPage({
    ok: true,
    data: [{
      _id: '507f1f77bcf86cd799439011',
      email: 'one@example.com',
      validationStatus: 'valid',
      contactStatus: 'sendable',
      score: 98,
      source: 'single',
      lastValidatedAt: '2026-08-11T10:00:00.000Z',
      lastSendStatus: 'accepted',
    }],
    pagination: {
      currentPage: 1,
      totalItems: 1,
      totalPages: 1,
      itemsPerPage: 20,
      sendableTotal: 1,
    },
  }).contacts[0]?.lastSendStatus, 'sent');
});

test('maps missing send state to never_sent', () => {
  const page = parseValidContactsPage(validEnvelopeWithoutLastSendStatus);
  assert.equal(page.contacts[0]?.lastSendStatus, 'never_sent');
});

test('preserves unauthorized status', () => {
  assert.equal(new ValidContactsApiError(401, 'Session expired.').status, 401);
});
```

Also mock `globalThis.fetch` and assert:

- list sends `Authorization: Bearer <token>` and passes the provided `AbortSignal`
- summary uses `/valid-contacts/summary`
- send uses `POST /email-sends`, JSON content type, bearer token, and exact JSON body
- non-2xx responses use a string or array backend `message`, falling back to a stable local message

- [ ] **Step 3: Run the new adapter test and verify it fails**

Run: `cd frontend && npx tsx --test services/api/validContactsApi.test.ts`

Expected: FAIL because the module and exported functions do not exist.

- [ ] **Step 4: Implement runtime parsing, query construction, and HTTP calls**

Create `validContactsApi.ts` with these exports:

```ts
export class ValidContactsApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ValidContactsApiError';
  }
}

export function buildValidContactsQuery(
  filters: ContactFilters,
  page: number,
  limit: number,
): string;

export function parseValidContactsPage(value: unknown): ValidContactsPage;
export function parseValidContactsSummary(value: unknown): ValidContactsSummary;
export function parseEmailSendResult(value: unknown): EmailSendResult;

export async function listValidContacts(
  filters: ContactFilters,
  page: number,
  limit: number,
  accessToken: string,
  signal?: AbortSignal,
): Promise<ValidContactsPage>;

export async function getValidContactsSummary(
  accessToken: string,
  signal?: AbortSignal,
): Promise<ValidContactsSummary>;

export async function sendContactEmail(
  input: SendEmailInput,
  accessToken: string,
): Promise<EmailSendResult>;
```

Use `URLSearchParams`; trim search; omit empty strings and every `'all'` filter; always include `sort`, `page`, and `limit`. Runtime parsers must reject missing IDs, unsupported enum values, nonnumeric pagination/counts, or malformed send results with `ValidContactsApiError(502, 'Invalid ... response.')`.

Use one internal `requestJson` helper that parses JSON safely, extracts backend `message` strings/arrays, throws `ValidContactsApiError` for non-2xx responses, and never logs tokens or bodies.

- [ ] **Step 5: Run the adapter and domain tests**

Run: `cd frontend && npx tsx --test services/api/validContactsApi.test.ts features/valid-contacts/validContacts.test.ts`

Expected: adapter, filtering, selection, and composer tests all PASS.

- [ ] **Step 6: Commit the adapter foundation**

Stage only the new API module/tests and the additive domain types:

```bash
git -C frontend add services/api/validContactsApi.ts services/api/validContactsApi.test.ts features/valid-contacts/validContacts.ts
git -C frontend commit -m "feat: add valid contacts API client"
```

---

### Task 6: Build Explicit and All-Matching Send Payloads

**Files:**

- Modify: `frontend/features/valid-contacts/validContacts.ts`
- Modify: `frontend/features/valid-contacts/validContacts.test.ts`

**Interfaces:**

- Produces: `buildSendEmailInput(selection, filters, subject, message, clientRequestId): SendEmailInput`.
- Consumes: `ContactSelection`, `ContactFilters`, and the Task 5 send-input types.

- [ ] **Step 1: Remove obsolete client-filter tests and add failing payload tests**

Delete tests for `filterContacts`, which no longer exists. Keep composer and selection tests. Add:

```ts
it('builds an explicit recipient payload', () => {
  assert.deepEqual(buildSendEmailInput(
    { mode: 'explicit', ids: ['contact-1', 'contact-2'] },
    DEFAULT_FILTERS,
    ' Hello ',
    ' Message ',
    'e67c6fca-9380-4db3-98e6-c5c5f72211d2',
  ), {
    clientRequestId: 'e67c6fca-9380-4db3-98e6-c5c5f72211d2',
    subject: 'Hello',
    message: 'Message',
    contactIds: ['contact-1', 'contact-2'],
  });
});

it('builds all-matching filters and exclusions without UI-only values', () => {
  assert.deepEqual(buildSendEmailInput(
    { mode: 'allMatching', total: 8, excludedIds: ['contact-3'] },
    {
      ...DEFAULT_FILTERS,
      validationStatus: 'all',
      source: 'bulk',
      activity: 'failed',
      search: ' acme ',
      dateFrom: '2026-08-01',
    },
    'Hello',
    'Message',
    'e67c6fca-9380-4db3-98e6-c5c5f72211d2',
  ), {
    clientRequestId: 'e67c6fca-9380-4db3-98e6-c5c5f72211d2',
    subject: 'Hello',
    message: 'Message',
    allMatching: {
      search: 'acme',
      source: 'bulk',
      activity: 'failed',
      dateFrom: '2026-08-01',
      excludedIds: ['contact-3'],
    },
  });
});
```

- [ ] **Step 2: Run the domain test and verify failure**

Run: `cd frontend && npx tsx --test features/valid-contacts/validContacts.test.ts`

Expected: FAIL because `buildSendEmailInput` is not exported.

- [ ] **Step 3: Implement the pure payload builder**

Add:

```ts
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
```

- [ ] **Step 4: Run all valid-contact pure tests**

Run: `cd frontend && npx tsx --test features/valid-contacts/validContacts.test.ts services/api/validContactsApi.test.ts`

Expected: all selected tests PASS.

- [ ] **Step 5: Commit selection payload behavior**

```bash
git -C frontend add features/valid-contacts/validContacts.ts features/valid-contacts/validContacts.test.ts
git -C frontend commit -m "feat: build contact email selections"
```

---

### Task 7: Connect the Valid Emails Workspace to Persisted APIs

**Files:**

- Modify: `frontend/features/valid-contacts/ValidContactsWorkspace.tsx`
- Modify: `frontend/features/valid-contacts/ValidContactsWorkspace.module.css`

**Interfaces:**

- Consumes: Redux `state.auth.accessToken` and `clearSession()`.
- Consumes: Task 5 list/summary/send API functions and error class.
- Consumes: Task 6 `buildSendEmailInput()`.
- Produces: the existing `/dashboard/valid-emails` page backed entirely by persisted API data.

- [ ] **Step 1: Replace mock-derived state with server state**

Update imports to remove `filterContacts` and `MOCK_VALID_CONTACTS`, then add API/Redux imports. Add state with exact initial values:

```ts
const accessToken = useAppSelector((state) => state.auth.accessToken);
const dispatch = useAppDispatch();
const [contactsPage, setContactsPage] = useState<ValidContactsPage>({
  contacts: [], total: 0, page: 1, limit: PAGE_SIZE,
  totalPages: 0, sendableTotal: 0,
});
const [summary, setSummary] = useState<ValidContactsSummary>({
  valid: 0, risky: 0, suppressed: 0, sent: 0, neverSent: 0,
});
const [isInitialLoading, setIsInitialLoading] = useState(true);
const [isRefreshing, setIsRefreshing] = useState(false);
const [loadError, setLoadError] = useState<string | null>(null);
const [reloadKey, setReloadKey] = useState(0);
const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
```

Use `contactsPage.contacts` as `visibleContacts`, `contactsPage.total` for pagination copy, `contactsPage.totalPages` for navigation, and `contactsPage.sendableTotal` when calling `selectAllMatching`.

- [ ] **Step 2: Add debounced, abortable list and summary loading**

Use a 300 ms search debounce and a fetch effect:

```ts
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
    hasLoadedOnce.current ? setIsRefreshing(true) : setIsInitialLoading(true);
    try {
      const [nextPage, nextSummary] = await Promise.all([
        listValidContacts(requestFilters, page, PAGE_SIZE, accessToken, controller.signal),
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
      setLoadError(error instanceof Error ? error.message : 'Unable to load valid contacts.');
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
```

Declare `const hasLoadedOnce = useRef(false);` with the other component state and add `useRef` to the React import. This keeps refresh state correct without making the effect depend on the contact response it updates.

- [ ] **Step 3: Replace simulated sending with the real send lifecycle**

Implement `handleSend` with no timeout and no optimistic row mutation:

```ts
const handleSend = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  if (composerError || !accessToken) {
    setSendFeedback(composerError ?? 'Your session has expired. Please sign in again.');
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
    setSendFeedbackTone(result.failedCount > 0 ? 'warning' : 'success');
    setSendFeedback(
      `${result.acceptedCount} accepted${result.failedCount > 0
        ? `, ${result.failedCount} failed`
        : ''}.`,
    );
    setSelection(clearSelection());
    setReloadKey((value) => value + 1);
  } catch (error) {
    if (error instanceof ValidContactsApiError && error.status === 401) {
      dispatch(clearSession());
    }
    setSendFeedbackTone('error');
    setSendFeedback(error instanceof Error ? error.message : 'Unable to send email.');
  } finally {
    setIsSending(false);
  }
};
```

Add `sendFeedbackTone: 'success' | 'warning' | 'error'` state. Do not use `composerError` to determine response color after a request; use this explicit tone.

- [ ] **Step 4: Render accurate loading, empty, retry, refresh, and send states**

Make these exact UI changes:

- Remove `Design preview · Mock data`.
- Remove `CONTACT_SEEDS`, `MOCK_VALID_CONTACTS`, and `filterContacts` from `validContacts.ts`, remove their workspace imports, and remove the obsolete client-filtering tests from `validContacts.test.ts`.
- Change the sender field to `Configured SMTP mailbox`.
- Change helper copy to `Replies will arrive in the configured sender inbox.`
- Summary cards use `summary.valid`, `summary.risky`, `summary.suppressed`, and `summary.sent`.
- Show `Updating…` beside the matching-count copy while `isRefreshing`.
- During initial loading, render `Loading valid contacts…` in the contact list.
- On `loadError`, render the message and a Retry button calling `setReloadKey(value => value + 1)`.
- Distinguish zero total (`No valid contacts saved yet`) from zero filtered matches (`No contacts match these filters`).
- Disable pagination and selection controls while refreshing.
- Display `Showing start–end of contactsPage.total` with `Math.max(1, contactsPage.totalPages)` only in page-number copy.
- Offer `Select all ${contactsPage.sendableTotal} matching sendable contacts` only after all visible sendable rows are explicitly selected and `sendableTotal` exceeds visible sendable IDs.
- Remove the inaccurate cross-page `riskySelected` warning; the backend remains authoritative for eligibility.
- Button copy while sending is `Sending…`.

Add CSS Module classes using current colors/spacing rather than new global tokens:

```css
.loadingState,
.errorState {
  min-height: 220px;
  display: grid;
  place-items: center;
  text-align: center;
  color: #667085;
}

.retryButton {
  margin-top: 12px;
}

.refreshIndicator {
  margin-left: 8px;
  color: #7c3aed;
  font-size: 12px;
}

.feedbackWarning {
  color: #b54708;
  background: #fffaeb;
  border-color: #fedf89;
}
```

- [ ] **Step 5: Run frontend feature verification**

Run: `cd frontend && npm test`

Expected: all Node/tsx tests PASS with no mock-data imports.

Run: `cd frontend && npm run typecheck`

Expected: PASS with no missing union cases, stale mock symbols, or effect type errors.

- [ ] **Step 6: Commit the connected workspace**

```bash
git -C frontend add features/valid-contacts/ValidContactsWorkspace.tsx features/valid-contacts/ValidContactsWorkspace.module.css
git -C frontend commit -m "feat: connect valid emails workspace"
```

---

### Task 8: Complete Cross-Repository Verification and Release Checks

**Files:**

- Modify only if a test proves necessary: files already named in Tasks 1–7.

**Interfaces:**

- Consumes: all prior tasks.
- Produces: locally verified backend/frontend builds and a deployment checklist without sending a real email.

- [ ] **Step 1: Run backend unit tests without the erroneous extra `--` argument**

Run: `cd backend && pnpm exec jest --runInBand`

Expected: all unit suites PASS. Use this exact command; `pnpm test -- --runInBand` incorrectly passes `--runInBand` as a Jest test-name pattern in this project environment.

- [ ] **Step 2: Run backend e2e, non-mutating lint, and production build**

Run:

```bash
cd backend
pnpm test:e2e
pnpm exec eslint "{src,apps,libs,test}/**/*.ts"
pnpm run build
```

Expected: e2e PASS, ESLint exits `0` without rewriting files, and Nest production build exits `0`.

- [ ] **Step 3: Run frontend full tests, typecheck, and production build**

Run:

```bash
cd frontend
npm test
npm run typecheck
npm run build
```

Expected: every test passes, TypeScript exits `0`, and Next.js produces a successful production build including `/dashboard/valid-emails`.

- [ ] **Step 4: Inspect the final diff and confirm change isolation**

Run:

```bash
git -C backend diff --check
git -C frontend diff --check
git -C backend status --short
git -C frontend status --short
```

Confirm only feature files were committed and unrelated CRLF changes remain untouched. The `sendableTotal` specification clarification was committed with this implementation plan before execution began, so no documentation-only implementation commit is required here.

- [ ] **Step 5: Configure deployment environments before deploying**

In the frontend Vercel project set:

```text
NEXT_PUBLIC_API_BASE_URL=https://ilmify-mail-metrics-backend.vercel.app/api/v1
```

Keep backend SMTP and JWT values only in the backend Vercel project. Do not print or copy their values into logs, commits, screenshots, or frontend variables. Ensure backend `CORS_ORIGINS` includes the deployed frontend origin.

- [ ] **Step 6: Deploy backend before frontend and run read-only live smoke checks**

After the relevant branches are pushed/deployed, run:

```bash
curl -i https://ilmify-mail-metrics-backend.vercel.app/api/v1/health
curl -I https://ilmify-mail-metrics-backend.vercel.app/api/v1/docs
curl -i https://ilmify-mail-metrics-backend.vercel.app/api/v1/valid-contacts
curl -i https://ilmify-mail-metrics-backend.vercel.app/api/health
```

Expected:

- versioned health: `200`
- versioned Swagger: `200`
- unauthenticated valid contacts: `401`
- old unversioned health: `404`

Then open the deployed frontend, authenticate, and verify list, summary, filters, pagination, selection, and composer validation. Do not press Send against a real address until the user explicitly approves that recipient.

- [ ] **Step 7: Report verification evidence and any remaining external step**

Report backend unit/e2e/lint/build results separately from frontend test/typecheck/build results. Report live route status separately from local checks. If no real send was approved, state clearly that SMTP delivery remains unverified rather than claiming email sending is proven.

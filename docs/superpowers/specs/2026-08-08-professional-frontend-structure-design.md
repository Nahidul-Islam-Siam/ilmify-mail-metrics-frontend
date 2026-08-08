# Professional Frontend Structure Design

## Goal

Reorganize the frontend into clear Next.js route groups and responsibility-based
folders without changing existing production URLs, behavior, or visual design.

## Route Structure

Next.js `app/layout.tsx` remains the required root document layout and owns only
global metadata, fonts, global CSS, and the application provider.

Routes are organized with URL-neutral route groups:

```text
app/
  layout.tsx
  (common)/
    layout.tsx
    page.tsx
  (auth)/
    layout.tsx
    login/
      page.tsx
    forgot-password/
      page.tsx
  (dashboard)/
    dashboard/
      layout.tsx
      ...existing dashboard routes
    super-admin/
      layout.tsx
      page.tsx
```

The `(common)` group owns public pages, `(auth)` owns authentication pages, and
`(dashboard)` owns every authenticated user and Super Admin route. Parentheses
must not appear in browser URLs.

The canonical authentication URLs remain `/login` and `/forgot-password`.
Duplicate `/auth/*` routes are removed. Existing `/dashboard/*` and
`/super-admin` URLs remain unchanged.

## Layout Components

Reusable layout implementations live under `components/layouts/`:

```text
components/layouts/
  CommonLayout.tsx
  AuthLayout.tsx
  DashboardLayout.tsx
  SuperAdminLayout.tsx
```

Route `layout.tsx` files remain thin adapters that render the relevant layout
component. Common layout handles public presentation, Auth layout handles the
authentication shell, Dashboard layout handles the normal dashboard shell, and
SuperAdmin layout handles the Super Admin shell.

The existing `DashboardShell` implementation becomes `DashboardLayout`, and
`SuperAdminShell` becomes `SuperAdminLayout`. `CommonLayout` and `AuthLayout`
wrap their existing presentation without duplicating markup. No visual redesign
is included.

## Redux Structure

Rename `store/` to `redux/`. Redux contains state-management code only:

```text
redux/
  store.ts
  hooks.ts
  provider.tsx
  features/
    auth/
      authSlice.ts
      authPersist.ts
      authSlice.test.ts
      authPersist.test.ts
    validation/
      validationSlice.ts
```

Authentication persistence continues to save only the authenticated user,
access token, and refresh token. Validation state and transient authentication
flags remain non-persisted.

## API Services

Backend integration is separated from Redux:

```text
services/api/
  apiUrl.ts
  apiUrl.test.ts
  authApi.ts
  authApi.test.ts
  validationApi.ts
```

API modules own URL construction, request payloads, response parsing, and API
errors. Redux thunks consume these modules but API modules never import Redux.

## Feature Code

Domain behavior that is neither routing, reusable UI, Redux state, nor raw API
transport belongs under `features/`:

```text
features/
  auth/
    usePermission.ts
    permissionHelpers.ts
    permissionHelpers.test.ts
  validation/
    components/
    types.ts
```

The existing RBAC definitions move to `features/auth/types.ts`, and validation
definitions move to `features/validation/types.ts`. Only code actively serving
the current MVP is moved into feature folders. Unrelated future-page refactors
are excluded to keep this structural change reviewable.

## Shared Components and Types

Reusable components are organized by responsibility:

```text
components/
  layouts/
  ui/
  marketing/
  dashboard/
  super-admin/
```

Components used by only one feature remain with that feature. The existing
shared UI definitions remain in `types/ui.ts`; auth and validation definitions
move to their explicitly assigned feature folders above.

## Dependency Direction

Dependencies flow in one direction:

```text
app -> components/features -> redux -> services/api
```

Shared types and UI primitives may be consumed at any higher layer. Services
must not import Redux, React components, or route modules. Redux must not import
route modules or UI components.

## Migration and Verification

Files are moved with import updates in small, independently verified commits.
Route tests verify the canonical URLs and absence of duplicate `/auth/*` routes.
Existing Redux, authentication, permission, navigation, and API tests remain
green after their paths change. Final verification requires the complete test
suite, strict TypeScript checking, a production Next.js build, and a clean Git
diff check.

## Success Criteria

- Routes are grouped under `(common)`, `(auth)`, and `(dashboard)`.
- Common, Auth, Dashboard, and Super Admin layouts have explicit boundaries.
- Browser URLs do not change.
- Duplicate `/auth/*` routes no longer build.
- Redux code lives under `redux/` and is grouped by feature.
- API integration lives under `services/api/` and does not depend on Redux.
- Auth feature behavior lives under `features/auth/`.
- Existing functionality, styling, tests, and production build remain intact.

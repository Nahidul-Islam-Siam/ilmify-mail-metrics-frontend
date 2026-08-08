# Redux Authentication Persistence Design

## Goal

Move frontend authentication and permission state from React Context to Redux
Toolkit, React Redux, and Redux Persist without changing the approved backend
authentication contract or current dashboard behavior.

## Scope

The migration covers login, session restoration, one-time refresh after an
unauthorized profile response, logout, current-user updates, and permission
helpers. OTP, registration, password recovery, social login, and broader API
state management remain outside this MVP.

Redux Persist will save authentication session data only. Validation results
and request-status fields remain temporary.

## Store Architecture

Add an `auth` slice alongside the existing `validation` slice. Its state is:

- `user`: the normalized authenticated user or `null`.
- `accessToken`: the current access token or `null`.
- `refreshToken`: the current refresh token or `null`.
- `loading`: whether an auth request is active.
- `initialized`: whether startup session validation has completed.
- `error`: the latest user-facing authentication error or `null`.

Async thunks own the authentication lifecycle:

- Login calls the existing login API boundary and stores the returned session.
- Restore validates a persisted access token through `/api/auth/me`. A `401`
  triggers exactly one refresh request; a successful refresh replaces both
  tokens and the user. Any terminal failure clears the session.
- Logout calls the backend when a complete session exists and always clears
  Redux authentication state, even if the network request fails.
- User updates use a synchronous reducer for profile fields already supported
  by the current frontend contract.

## Persistence

Configure Redux Persist with local storage and a whitelist containing only the
`auth` slice. Within the auth slice, persist only `user`, `accessToken`, and
`refreshToken`; loading, initialization, and error state must reset on reload.

The provider must be safe with Next.js rendering. Store and persistor creation
will happen in the client provider, and `PersistGate` will delay rendering until
rehydration completes. After rehydration, the provider dispatches session
restoration once.

When the client store initializes, it will remove the previous manual
`mm_access_token`, `mm_refresh_token`, and `mm_token` keys so Redux Persist is
the single session owner.

## Compatibility Layer

Remove `PermissionProvider` from the root layout. Keep the public
`usePermission()` hook so existing pages and components do not require a broad
rewrite. The hook will read typed Redux selectors, dispatch auth actions, and
derive the existing permission helpers:

- current role and permission list;
- `hasPermission`;
- `canCreateRole`;
- `getAllowedRolesToCreate`;
- login, logout, and user update methods.

Login continues returning the existing `AuthResult`, including the role-based
dashboard destination. This keeps routing behavior unchanged.

## Error Handling

Thunk rejections use readable messages from the existing API boundary. Failed
login does not create a session. Failed restoration or refresh clears all
persisted session data. Logout always resolves local cleanup, regardless of
backend availability.

## Testing and Verification

Reducer tests will cover login/session state, clearing state after terminal
restore failure, and non-persisted transient fields. Persistence configuration
tests will verify that validation state and auth request status are not saved.
Existing auth API, routing, navigation, and validation tests must continue to
pass. Final verification includes strict TypeScript checking and a production
Next.js build.

## Success Criteria

- Authentication state is owned by Redux Toolkit.
- React Redux supplies state and dispatch throughout the application.
- Redux Persist restores only authentication session fields.
- Startup verifies the restored session and refreshes at most once.
- Existing login, logout, permission, role-routing, single validation, and bulk
  validation behavior remains functional.

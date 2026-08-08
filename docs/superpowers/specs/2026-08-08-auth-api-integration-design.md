# Authentication API Integration Design

## Goal

Connect the frontend to the existing backend login, session restoration, token
refresh, and logout APIs. Signup, OTP, forgot-password, reset-password, and social
login remain outside this MVP because their backend flows depend on OTP or disabled
integrations.

## API contract

- `POST /api/auth/login` receives `{ email, password }` and returns `accessToken`,
  `refreshToken`, and `user`.
- `GET /api/auth/me` receives the access token as a Bearer token and returns the
  current user.
- `POST /api/auth/refresh-token` receives `{ refreshToken }`, rotates both tokens,
  and returns the refreshed user/session response.
- `POST /api/auth/logout` receives the access token and `{ refreshToken }`, then
  revokes that session.

All frontend requests use relative `/api` URLs through the existing Next.js proxy.

## Token lifecycle

The frontend stores the access token as `mm_access_token` and refresh token as
`mm_refresh_token`. On startup it restores `/auth/me`. If that request returns 401,
it performs one refresh, stores the rotated tokens, and retries `/auth/me` once.
Refresh failure clears both tokens and redirects to `/login`; no refresh loop is
allowed.

Successful login normalizes the backend role and redirects to the role's default
dashboard. Logout calls the backend when both tokens exist, always clears local
state even if the network call fails, and redirects to `/login`.

## Interface and errors

The login page renders backend validation or authentication messages. The top bar
provides a working logout action. Authentication parsing rejects malformed token
or user responses rather than treating them as successful sessions.

## Verification

Pure tests cover response parsing, token persistence, refresh-once behavior, and
local cleanup after logout failure. Frontend tests, strict type checking, and the
production build must pass.

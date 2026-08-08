# Separated Super Admin and User Dashboards

## Goal

Separate platform management from normal email-validation work in the frontend
without duplicating feature implementations. Admin receives the same frontend
access as Super Admin for this MVP; permissions can be reduced later.

## Routes and access

- `/super-admin` is the landing area for `superadmin` and `admin`.
- `/dashboard` is the landing area for `user`, `client`, and `sub_user`.
- Super Admin and Admin may also open shared validation features.
- User and Sub User must be redirected away from `/super-admin` to `/dashboard`.
- Unauthenticated visitors must be redirected to `/login`.

After login, the frontend routes the authenticated account to the correct landing
area. Backend role values are normalized at the authentication boundary:
`superadmin` becomes `Super Admin`, `admin` becomes `Admin`, `client` and `user`
become `User`, and `sub_user` becomes `Sub User`.

## Layouts and navigation

The Super Admin area has its own shell and navigation focused on overview, users,
disposable domains, analytics, settings, and links to single and bulk validation.
The user dashboard shell focuses on overview, single validation, bulk validation,
history, subscription, and account settings.

Feature implementations remain shared. Links may point to existing feature routes
under `/dashboard` where appropriate; the project must not copy whole page
implementations into both route trees.

## Authentication state

The permission provider starts unauthenticated and restores a token/profile from
local storage. It no longer creates a fake Super Admin session by default. The
development role switcher is removed from the normal top bar so real backend roles
control routing and navigation.

## Error and loading behavior

Route guards wait until authentication restoration finishes before redirecting,
preventing redirect flashes. Invalid or expired sessions clear local state and go
to `/login`. Unauthorized dashboard paths redirect to the correct role landing
page rather than rendering an access-denied page inside the wrong shell.

## Verification

Frontend tests will cover role normalization and role-to-dashboard routing as pure
functions. Type checking and the production build must pass. Manual route review
must confirm each role sees only its intended shell and navigation.

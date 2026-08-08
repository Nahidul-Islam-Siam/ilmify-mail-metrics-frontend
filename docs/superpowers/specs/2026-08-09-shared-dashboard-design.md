# Shared Dashboard Design

## Goal

Restore the visual appearance from the repository's first commit (`a41bb0f`) for every dashboard entry point, including `/super-admin`. This is a UI restoration only: the current TypeScript architecture, authentication, API integration, and route separation remain unchanged.

## Visual behavior

- The first commit's dashboard is the visual reference, including its full sidebar, top bar, metric cards, charts, activity table, icons, spacing, colors, typography, and responsive behavior.
- `/dashboard` and `/super-admin` use that same visual system.
- Dashboard routes continue to use their role-appropriate navigation items while sharing the restored sidebar appearance.
- No new dashboard visual language or simplified card-grid landing screen is introduced.

## Architecture

- Recreate the first commit's appearance inside the current TypeScript components; do not restore or copy the obsolete JavaScript architecture.
- Extract the dashboard page presentation into a shared dashboard overview component.
- Render that component from both `/dashboard` and `/super-admin` so the design cannot drift between roles.
- Keep the existing route-group structure, Redux authentication state, API services, and middleware behavior.
- Keep the distinct dashboard and Super Admin navigation definitions so future access restrictions can be introduced without another visual rewrite.
- Keep real authenticated user information and logout behavior in the restored top bar; do not restore the original demo role switcher.

## Data behavior

The current placeholder dashboard metrics remain unchanged. API-backed role-specific metrics are outside this change and can replace the shared placeholder values later through component props or a shared metrics state boundary.

## Error handling

Authentication failures continue through the existing Redux/API flow. The middleware remains only an early unauthenticated-navigation guard and does not alter dashboard rendering.

## Verification

- Add a structural test proving both dashboard pages render the shared overview component.
- Run the complete frontend test suite and TypeScript check.
- Run a production build and verify both `/dashboard` and `/super-admin` are generated.
- Manually verify both routes use the same dashboard content after authentication.

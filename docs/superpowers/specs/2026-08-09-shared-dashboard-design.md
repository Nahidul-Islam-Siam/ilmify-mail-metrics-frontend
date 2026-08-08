# Shared Dashboard Design

## Goal

Preserve the complete existing `/dashboard` visual design for every dashboard entry point, including `/super-admin`. The authentication and route separation remain unchanged.

## Visual behavior

- `/dashboard` remains the visual reference and is not redesigned.
- `/super-admin` renders the same dashboard header, metric cards, charts, activity table, spacing, colors, typography, and responsive behavior.
- Dashboard routes continue to use their role-appropriate sidebar navigation while sharing the same shell styling.
- No new dashboard visual language or simplified card-grid landing screen is introduced.

## Architecture

- Extract the existing dashboard page presentation into a shared dashboard overview component.
- Render that component from both `/dashboard` and `/super-admin` so the design cannot drift between roles.
- Keep the existing route-group structure, Redux authentication state, API services, and middleware behavior.
- Keep the distinct dashboard and Super Admin navigation definitions so future access restrictions can be introduced without another visual rewrite.

## Data behavior

The current placeholder dashboard metrics remain unchanged. API-backed role-specific metrics are outside this change and can replace the shared placeholder values later through component props or a shared metrics state boundary.

## Error handling

Authentication failures continue through the existing Redux/API flow. The middleware remains only an early unauthenticated-navigation guard and does not alter dashboard rendering.

## Verification

- Add a structural test proving both dashboard pages render the shared overview component.
- Run the complete frontend test suite and TypeScript check.
- Run a production build and verify both `/dashboard` and `/super-admin` are generated.
- Manually verify both routes use the same dashboard content after authentication.

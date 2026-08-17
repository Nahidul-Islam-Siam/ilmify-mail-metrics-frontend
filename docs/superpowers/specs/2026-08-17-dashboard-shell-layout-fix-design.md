# Dashboard Shell Layout Fix Design

## Goal

Fix the shared authenticated dashboard shell so the sidebar and topbar remain visible, page headings are never covered, and dashboard content does not overflow at desktop, tablet, or mobile widths.

This change is limited to layout and responsive behavior. It does not change dashboard data, validation behavior, navigation permissions, API calls, or unfinished user changes elsewhere in the frontend.

## Confirmed Problems

- The page scrolls at the browser-body level, so the sidebar brand and navigation move out of view.
- The sticky topbar can cover the dashboard page heading while scrolling.
- The shell uses inline styles while the older responsive shell rules in `dashboard.css` are not applied to these components.
- The mobile menu state changes the sidebar display without a proper off-canvas drawer, backdrop, close behavior, or scroll isolation.
- Dashboard metric grids are sized using viewport breakpoints even though the sidebar reduces the available content width.

## Layout Model

Use one shared CSS module for the shell, sidebar, topbar, and mobile backdrop.

On desktop:

- the shell occupies `100dvh` and prevents body-level page scrolling;
- the sidebar occupies a fixed 264-pixel column and remains visible;
- the right column contains the topbar above a separately scrollable main-content region;
- the topbar remains visible because it sits outside the scrolling content, not because it overlaps content with fixed positioning;
- the main region owns vertical scrolling and keeps enough top and side padding for page headings and actions.

On tablet and mobile:

- the shell becomes a single-column layout;
- the sidebar becomes an off-canvas drawer above the page;
- the hamburger opens and closes the drawer;
- a backdrop closes the drawer when clicked;
- Escape closes the drawer;
- navigation closes the drawer after route changes;
- background page scrolling is disabled while the drawer is open.

## Component Boundaries

- `DashboardLayout` owns the shell, mobile-menu state, backdrop, and scroll regions.
- `Sidebar` owns navigation and identity presentation. It receives open/close state but does not own global layout.
- `Topbar` owns search, credits, logout, identity, and the mobile-menu trigger.
- `DashboardOverview` keeps its existing real-data behavior. Only its responsive metric-grid sizing may be adjusted so available content width, rather than the full viewport, determines card wrapping.

Inline layout declarations will be replaced only where necessary by named CSS-module classes. No unrelated visual redesign is included in this first task.

## Responsive Rules

- Wide desktop: five metric cards may fit in one row when each card has usable minimum width.
- Smaller desktop/tablet: cards wrap without horizontal page overflow.
- Mobile: cards use one column, header actions wrap, and the recent-contacts presentation remains usable.
- Long emails and profile text must shrink or truncate instead of widening the shell.

## Accessibility

- The hamburger exposes `aria-expanded`, `aria-controls`, and an accessible label.
- The sidebar is identified as the controlled navigation drawer.
- The backdrop is an actual button with an accessible label.
- Escape closes the mobile drawer.
- Keyboard focus styles remain visible.
- Reduced-motion preferences disable drawer transitions.

## Verification

- Add focused source/behavior tests for shell class wiring and accessible mobile controls.
- Keep existing dashboard overview tests passing.
- Run the complete frontend test suite and TypeScript checking.
- Run the production build separately when no development server is sharing `.next`.
- Manually verify desktop, tablet, and mobile widths, including scrolling, drawer closing, heading visibility, and absence of horizontal overflow.

## Deferred Work

Visual redesigns of metric cards, charts, table styling, sidebar information architecture, and topbar product features are separate follow-up tasks. This first task establishes a stable responsive shell for those improvements.

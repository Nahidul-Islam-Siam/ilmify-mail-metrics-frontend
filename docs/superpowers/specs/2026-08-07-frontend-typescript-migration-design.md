# Frontend TypeScript Migration Design

## Goal

Convert the complete `ilmify-mail-metrics-frontend` Next.js 14 App Router application from JavaScript/JSX to strict TypeScript while preserving its current UI and behavior. Small correctness and code-quality fixes exposed by the migration are included; unrelated redesigns and refactors are excluded.

## Scope

use redux persist

- Convert every application-owned `.js` and `.jsx` module under `app`, `components`, `context`, `data`, `hooks`, `lib`, and `store` to `.ts` or `.tsx` as appropriate.
- Convert `next.config.js` to a TypeScript-supported configuration format if supported cleanly by the installed Next.js version; otherwise retain it as the sole configuration JavaScript file and exclude it explicitly from the application-source conversion requirement.
- Add TypeScript compiler configuration and required React/Node type dependencies.
- Add explicit types for React props, children, state, callbacks, DOM events, refs, and Next.js layouts/pages where inference is insufficient.
- Type Redux state, actions, async thunks, dispatch, selectors, and persisted-store integration centrally.
- Type permission/RBAC users, roles, permissions, context operations, and authentication results centrally.
- Type API request/response boundaries and email-validation results. Untrusted response bodies begin as `unknown` and are narrowed before use when practical.
- Type static content and page-local datasets without broadening the migration into a content or UI rewrite.

Third-party code in `node_modules`, generated Next.js output, CSS, environment files, lockfiles, and the separate backend are out of scope.

## TypeScript Policy

The project will use `strict: true`, `noEmit: true`, modern Next.js-compatible module settings, JSX preservation, and the Next.js TypeScript plugin. JavaScript source will not remain enabled as a migration escape hatch. Path aliases will only be introduced if they already provide a concrete benefit to existing imports.

`any` will not be used as a blanket migration mechanism. Prefer concrete domain types, generics, discriminated unions, `unknown` with narrowing, and React/DOM library types. A narrowly documented exception is acceptable only where a third-party API cannot be represented safely otherwise.

## Architecture and Type Placement

Cross-cutting domain contracts will live in a small top-level `types` area, grouped by concern such as API validation and RBAC. Types used by only one component or page will remain beside that code to avoid a monolithic type file.

The API module will own the public input and return types of its functions. Redux will export `RootState` and `AppDispatch`, plus typed hooks if selectors or dispatch are used across the UI. The permission context will expose a non-null context contract through its existing guarded hook, keeping consumers free from repetitive null checks.

Components will declare focused prop contracts. Generic reusable controls such as selects, toggles, tables, file uploads, modals, and charts will model their values and callbacks accurately instead of accepting arbitrary objects.

## Migration Sequence

1. Establish TypeScript configuration, dependencies, and a dedicated `typecheck` script.
2. Define shared API, validation, Redux, authentication, RBAC, and reusable UI contracts.
3. Convert foundational non-visual modules: configuration, data, API utilities, Redux, context, and hooks.
4. Convert shared providers and components, then dashboard/settings/integration components.
5. Convert App Router layouts and pages, preserving client/server component boundaries and existing `use client` directives.
6. Remove all remaining application-owned `.js`/`.jsx` files, resolve strict compiler errors, and run final verification.

## Behavior and Error Handling

The migration will preserve routes, rendered content, styling, local-storage keys, API URLs, request formats, offline email-validation fallback, Redux behavior, and RBAC behavior. Existing error paths remain user-visible in the same manner unless TypeScript exposes a definite bug, such as unsafe access to an absent field or an invalid event value.

Caught values are treated as `unknown`; UI messages use safe narrowing or stable fallback messages. Network response shapes are not assumed merely because a request succeeded. Authentication result types will make success and failure states distinguishable to callers.

## Testing and Acceptance Criteria

The migration is complete when:

- No application-owned `.js` or `.jsx` source remains, except `next.config.js` only if required by Next.js 14.2 compatibility.
- `tsconfig.json` enables strict checking and does not permit JavaScript source.
- `npm run typecheck` succeeds with zero TypeScript errors.
- `npm run build` succeeds.
- Existing routes and client/server component boundaries compile without behavioral redesign.
- A source scan confirms there are no broad `any` escapes or unchecked suppression comments such as `@ts-ignore` or `@ts-nocheck`.

Automated component tests are not introduced solely for this migration because the project has no existing test framework. Type checking and the production Next.js build are the required regression gates; targeted tests may be added only if a concrete conversion bug needs them.

## Constraints

The frontend directory is not currently inside a detected Git repository. The design document can be written and reviewed, but it cannot be committed until Git metadata is available. Package installation may update `package-lock.json` and requires access to the configured npm registry if the needed type packages are not already installed.

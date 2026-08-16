# Disposable Validation Warning Design

## Goal

Make a confirmed disposable-domain result immediately visible on the single-email validation page without hiding its evidence.

## Scope

- Add a small pure presentation helper that returns a disposable warning only when `emailType` is `disposable`.
- Render a red accessible warning banner above the normal result summary.
- Use the title `Disposable email detected`.
- Explain that the address uses a temporary provider, should not be used, and mailbox probing was skipped because the domain is classified as disposable.
- Keep the existing score, badges, validation evidence, and check cards visible below the banner.
- Add focused tests proving disposable results show the notice and other results do not.

## Constraints

- Do not change the API contract, validation types, backend, bulk page, or shared generic alert system.
- Preserve all pre-existing uncommitted frontend changes.
- Do not describe the mailbox as nonexistent; the banner communicates a policy classification.

## Verification

- Run the focused presentation-helper test.
- Run the complete frontend test suite and TypeScript check.

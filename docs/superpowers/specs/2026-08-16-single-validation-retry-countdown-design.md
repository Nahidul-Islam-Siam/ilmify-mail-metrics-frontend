# Single Validation Retry Countdown Design

## Goal

When a single mailbox probe is rejected by MailMetric's local or remote rate
limiter, tell the user exactly how long they must wait before trying again.
Do not present every temporary SMTP response as a rate-limit event.

## Data contract

The existing mailbox result already supports an optional `retryAfterMs` value.
The countdown is shown only when all of the following are true:

- the mailbox outcome is `temporary`;
- `retryAfterMs` is present, finite, and greater than zero; and
- a validation result is currently displayed.

A temporary SMTP response without `retryAfterMs` continues to show the normal
`retry later` recommendation without a countdown.

## User experience

For a rate-limited result, the page will:

- keep the validation result visible;
- show an accessible warning such as `Too many checks. Try again in 00:47`;
- disable the Validate email button;
- change the button label to `Retry in 47s`; and
- restore the normal enabled button when the countdown reaches zero.

The countdown will use a fixed deadline derived from `retryAfterMs` so browser
timer drift or a background tab does not extend the wait. It will not submit a
new validation automatically. Editing the email does not bypass the active
server-provided wait period.

## Accessibility and cleanup

The warning will use `role="status"` and `aria-live="polite"`. Any running timer
will be cleared when the result changes or the page unmounts.

## Testing

Focused tests will cover:

- rendering and formatting a countdown from `retryAfterMs`;
- disabling and relabelling the submit button while waiting;
- restoring the button at zero;
- omitting the countdown for temporary SMTP results without `retryAfterMs`; and
- timer cleanup/result replacement behavior.

The existing frontend test suite and TypeScript check must remain passing.

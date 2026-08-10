# Single Validation Empty Email Warning Design

## Goal

Prevent the single-email validation page from submitting an empty email address and show a clear warning within the existing interface.

## Behavior

- The email input starts empty instead of containing the demo value `test@example.com`.
- Submitting an empty or whitespace-only value shows `Please enter an email address.` in the page's existing red alert presentation.
- Empty submission does not start the loading state, refresh authentication, or call the validation API.
- Typing in the email field clears the empty-input warning so stale feedback does not remain visible.
- Non-empty submissions retain the current authentication refresh, API request, result, and error behavior.

## Implementation Boundary

Keep the behavior in the single-validation page. Add a small pure helper for the warning decision only if it provides a direct test boundary. Do not change the backend API, shared validation response contract, styling system, or other forms.

## Testing

Add a focused regression test that proves:

- empty and whitespace-only values return the warning;
- a non-empty email does not return the warning;
- the page starts with an empty input and uses the warning before calling the API.

Run the focused test, complete frontend tests, strict TypeScript check, and production build.

## Acceptance Criteria

- Clicking `Validate email` with no entered email displays `Please enter an email address.`
- No validation request is attempted for empty input.
- Entering text clears the warning.
- Valid submissions continue to behave as before.

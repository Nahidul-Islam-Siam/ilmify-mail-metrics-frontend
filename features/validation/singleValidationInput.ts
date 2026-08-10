export const EMPTY_EMAIL_WARNING = 'Please enter an email address.';

export function getSingleValidationInputWarning(email: string): string | null {
  return email.trim() ? null : EMPTY_EMAIL_WARNING;
}

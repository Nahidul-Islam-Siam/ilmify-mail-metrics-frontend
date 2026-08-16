import React from 'react';
import { formatRetryCountdown } from '../retryCountdown';

interface RetryCountdownProps {
  loading?: boolean;
  retrySeconds: number;
}

export function RetrySubmitButton({
  loading = false,
  retrySeconds,
}: RetryCountdownProps) {
  return (
    <button
      type="submit"
      disabled={loading || retrySeconds > 0}
      style={{
        padding: '12px 24px',
        border: 0,
        borderRadius: 10,
        background: '#7C3AED',
        color: '#fff',
        fontWeight: 700,
      }}
    >
      {loading
        ? 'Validating…'
        : retrySeconds > 0
          ? `Retry in ${retrySeconds}s`
          : 'Validate email'}
    </button>
  );
}

export function RetryCountdownNotice({ retrySeconds }: RetryCountdownProps) {
  if (retrySeconds <= 0) return null;

  return (
    <p
      role="status"
      aria-live="polite"
      style={{
        color: '#B54708',
        background: '#FFFAEB',
        padding: 14,
        borderRadius: 10,
      }}
    >
      Too many checks. Try again in {formatRetryCountdown(retrySeconds)}
    </p>
  );
}

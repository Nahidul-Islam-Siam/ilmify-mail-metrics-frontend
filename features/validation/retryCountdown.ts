import type { MailboxProbeResult } from './types';

type RetryMailbox = Pick<MailboxProbeResult, 'outcome' | 'retryAfterMs'>;

export interface RetryCountdownScheduler {
  now(): number;
  setInterval(callback: () => void, intervalMs: number): unknown;
  clearInterval(token: unknown): void;
}

export function getRetryDeadline(
  mailbox: RetryMailbox,
  nowMs = Date.now(),
): number | null {
  const waitMs = mailbox.retryAfterMs;
  if (
    mailbox.outcome !== 'temporary' ||
    waitMs === undefined ||
    !Number.isFinite(waitMs) ||
    waitMs <= 0
  ) {
    return null;
  }
  return nowMs + waitMs;
}

export function getRemainingRetrySeconds(
  deadlineMs: number | null,
  nowMs = Date.now(),
): number {
  if (deadlineMs === null) return 0;
  return Math.max(0, Math.ceil((deadlineMs - nowMs) / 1_000));
}

export function formatRetryCountdown(seconds: number): string {
  const safeSeconds = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

function browserScheduler(): RetryCountdownScheduler {
  return {
    now: Date.now,
    setInterval: (callback, intervalMs) =>
      window.setInterval(callback, intervalMs),
    clearInterval: (token) => window.clearInterval(token as number),
  };
}

export function startRetryCountdown(
  deadlineMs: number,
  onTick: (remainingSeconds: number) => void,
  scheduler: RetryCountdownScheduler = browserScheduler(),
): () => void {
  let timer: unknown;
  let stopped = false;

  const stop = () => {
    if (stopped) return;
    stopped = true;
    if (timer !== undefined) scheduler.clearInterval(timer);
  };

  const update = () => {
    if (stopped) return;
    const remaining = getRemainingRetrySeconds(deadlineMs, scheduler.now());
    onTick(remaining);
    if (remaining === 0) stop();
  };

  update();
  if (!stopped) timer = scheduler.setInterval(update, 250);
  return stop;
}

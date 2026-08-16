import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  formatRetryCountdown,
  getRemainingRetrySeconds,
  getRetryDeadline,
  startRetryCountdown,
  type RetryCountdownScheduler,
} from './retryCountdown';

test('creates a deadline only for a temporary result with a positive finite wait', () => {
  assert.equal(
    getRetryDeadline({ outcome: 'temporary', retryAfterMs: 47_250 }, 1_000),
    48_250,
  );
  assert.equal(getRetryDeadline({ outcome: 'temporary' }, 1_000), null);
  assert.equal(
    getRetryDeadline({ outcome: 'accepted', retryAfterMs: 47_250 }, 1_000),
    null,
  );
  assert.equal(
    getRetryDeadline(
      { outcome: 'temporary', retryAfterMs: Number.NaN },
      1_000,
    ),
    null,
  );
  assert.equal(
    getRetryDeadline({ outcome: 'temporary', retryAfterMs: 0 }, 1_000),
    null,
  );
});

test('derives remaining whole seconds from the deadline without going negative', () => {
  assert.equal(getRemainingRetrySeconds(48_250, 1_000), 48);
  assert.equal(getRemainingRetrySeconds(48_250, 47_251), 1);
  assert.equal(getRemainingRetrySeconds(48_250, 48_250), 0);
  assert.equal(getRemainingRetrySeconds(null, 1_000), 0);
});

test('formats countdown seconds as minutes and seconds', () => {
  assert.equal(formatRetryCountdown(0), '00:00');
  assert.equal(formatRetryCountdown(7), '00:07');
  assert.equal(formatRetryCountdown(67), '01:07');
});

test('ticks from a fixed deadline and clears its interval at zero', () => {
  let nowMs = 1_000;
  let tick: (() => void) | undefined;
  const clearedTokens: unknown[] = [];
  const timerToken = { id: 1 };
  const scheduler: RetryCountdownScheduler = {
    now: () => nowMs,
    setInterval: (callback, intervalMs) => {
      assert.equal(intervalMs, 250);
      tick = callback;
      return timerToken;
    },
    clearInterval: (token) => clearedTokens.push(token),
  };
  const observed: number[] = [];

  const cleanup = startRetryCountdown(
    48_250,
    (seconds) => observed.push(seconds),
    scheduler,
  );

  assert.deepEqual(observed, [48]);
  assert.ok(tick);
  nowMs = 48_250;
  tick();
  assert.deepEqual(observed, [48, 0]);
  assert.deepEqual(clearedTokens, [timerToken]);

  cleanup();
  assert.deepEqual(clearedTokens, [timerToken]);
});

test('cleanup cancels an active countdown when a result is replaced', () => {
  const timerToken = { id: 2 };
  const clearedTokens: unknown[] = [];
  const scheduler: RetryCountdownScheduler = {
    now: () => 1_000,
    setInterval: () => timerToken,
    clearInterval: (token) => clearedTokens.push(token),
  };

  const cleanup = startRetryCountdown(61_000, () => undefined, scheduler);
  cleanup();

  assert.deepEqual(clearedTokens, [timerToken]);
});

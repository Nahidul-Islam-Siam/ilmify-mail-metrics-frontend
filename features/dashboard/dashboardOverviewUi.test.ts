import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const component = readFileSync(
  new URL('./DashboardOverview.tsx', import.meta.url),
  'utf8',
);
const route = readFileSync(
  new URL('../../app/(dashboard)/dashboard/page.tsx', import.meta.url),
  'utf8',
);

test('dashboard renders only real contact metrics and recent activity', () => {
  assert.doesNotMatch(
    component,
    /250,000|234,567|125,460|sarah\.chen|Welcome back, John/,
  );
  assert.match(component, /loadDashboardOverview/);
  assert.match(component, /Total saved contacts/);
  assert.match(component, /Deliverable/);
  assert.match(component, /Risky/);
  assert.match(component, /Suppressed/);
  assert.match(component, /Previously contacted/);
  assert.match(component, /Recent contacts/);
  assert.match(component, /Quality score \{contact\.score\}\/100/);
});

test('dashboard exposes loading, empty, failure, and retry states', () => {
  assert.match(component, /status: 'loading'/);
  assert.match(component, /No saved contacts yet/);
  assert.match(component, /role="alert"/);
  assert.match(component, />\s*Retry\s*</);
  assert.match(component, /AbortController/);
});

test('dashboard route is a thin wrapper without demo values', () => {
  assert.match(route, /import DashboardOverview/);
  assert.match(route, /<DashboardOverview\s*\/>/);
  assert.doesNotMatch(
    route,
    /250,000|234,567|125,460|sarah\.chen|Welcome back, John/,
  );
});

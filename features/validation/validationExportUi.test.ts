import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const source = readFileSync(
  new URL('../../app/(dashboard)/dashboard/validation/bulk/page.tsx', import.meta.url),
  'utf8',
);

test('bulk validation page provides every export filter and both formats', () => {
  for (const value of ['all', 'valid', 'invalid', 'risky', 'unknown']) {
    assert.match(source, new RegExp(`value=["']${value}["']`));
  }
  assert.match(source, /Export CSV/);
  assert.match(source, /Export Excel/);
  assert.match(source, /matching results/);
});

test('bulk validation page delegates export formatting to its feature module', () => {
  assert.doesNotMatch(source, /function csvCell/);
  assert.doesNotMatch(source, /function downloadResults/);
  assert.match(source, /createValidationCsv/);
  assert.match(source, /createValidationWorkbook/);
});

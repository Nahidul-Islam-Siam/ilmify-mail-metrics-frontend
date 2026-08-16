import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const singleSource = readFileSync(
  new URL('../../app/(dashboard)/dashboard/validation/single/page.tsx', import.meta.url),
  'utf8',
);
const bulkSource = readFileSync(
  new URL('../../app/(dashboard)/dashboard/validation/bulk/page.tsx', import.meta.url),
  'utf8',
);

test('validation pages label quality scores and never render them as percentages', () => {
  assert.match(singleSource, /getQualityScoreLabel\(result\.score\)/);
  assert.doesNotMatch(singleSource, /\{result\.score\}\/100/);
  assert.match(bulkSource, /getQualityScoreLabel\(row\.score\)/);
});

test('single validation shows professional evidence and recommendation', () => {
  assert.match(singleSource, /result\.reason/);
  assert.match(singleSource, /result\.recommendation/);
  assert.match(singleSource, /result\.mailbox\.outcome/);
  assert.match(singleSource, /result\.expiresAt/);
});


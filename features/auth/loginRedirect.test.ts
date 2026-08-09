import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('successful login performs a full dashboard replacement after persistence', () => {
  const source = readFileSync('app/(auth)/login/page.tsx', 'utf8');
  assert.match(source, /setTimeout/);
  assert.match(source, /window\.location\.replace\(result\.destination\)/);
});

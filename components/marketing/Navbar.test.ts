import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('landing navbar exposes authenticated dashboard and logout controls', () => {
  const source = readFileSync('components/marketing/Navbar.tsx', 'utf8');
  assert.match(source, /usePermission/);
  assert.match(source, /Dashboard/);
  assert.match(source, /Logout/);
  assert.match(source, /user\?\.name/);
});

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const source = readFileSync(
  new URL('../../app/(dashboard)/dashboard/settings/page.tsx', import.meta.url),
  'utf8',
);

test('unavailable mailbox features are not presented as active', () => {
  assert.match(source, /Unavailable until mailbox worker is configured/);
  assert.match(source, /label="Enable Deep SMTP Handshake Verification"[\s\S]*disabled/);
  assert.match(source, /label="Enable AI Spam Trap & Honeypot Detection"[\s\S]*disabled/);
  assert.doesNotMatch(source, /Cross-reference domain against 100k\+ burner/);
  assert.doesNotMatch(source, /global spammer and domain blocklists/);
});


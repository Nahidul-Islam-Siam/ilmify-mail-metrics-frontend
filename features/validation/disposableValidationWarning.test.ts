import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { getDisposableValidationWarning } from './disposableValidationWarning';

test('returns the policy warning only for disposable email results', () => {
  assert.deepEqual(
    getDisposableValidationWarning({ emailType: 'disposable' }),
    {
      title: 'Disposable email detected',
      message:
        'This address uses a temporary email provider. We recommend not using it. Mailbox probing was skipped because the domain is classified as disposable.',
    },
  );
  assert.equal(
    getDisposableValidationWarning({ emailType: 'business' }),
    null,
  );
});

test('single validation renders the disposable warning above its evidence', () => {
  const source = readFileSync(
    new URL(
      '../../app/(dashboard)/dashboard/validation/single/page.tsx',
      import.meta.url,
    ),
    'utf8',
  );

  assert.match(source, /role="alert"/);
  assert.match(source, /disposableWarning\.title/);
  assert.match(source, /disposableWarning\.message/);
});

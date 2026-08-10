import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  EMPTY_EMAIL_WARNING,
  getSingleValidationInputWarning,
} from './singleValidationInput';

test('returns the empty-email warning only for blank input', () => {
  assert.equal(getSingleValidationInputWarning(''), EMPTY_EMAIL_WARNING);
  assert.equal(getSingleValidationInputWarning('   '), EMPTY_EMAIL_WARNING);
  assert.equal(getSingleValidationInputWarning('person@example.com'), null);
});

test('single validation page starts empty and guards before loading or API work', () => {
  const source = readFileSync(
    new URL(
      '../../app/(dashboard)/dashboard/validation/single/page.tsx',
      import.meta.url,
    ),
    'utf8',
  );

  assert.match(source, /useState\(''\)/);
  assert.match(source, /getSingleValidationInputWarning\(email\)/);
  assert.match(
    source,
    /if \(inputWarning\)[\s\S]*setError\(inputWarning\)[\s\S]*return/,
  );
  assert.match(
    source,
    /onChange=\{\(event\) => \{[\s\S]*setError\(null\)/,
  );
});

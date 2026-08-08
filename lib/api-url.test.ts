import assert from 'node:assert/strict';
import test from 'node:test';

import { buildApiUrl } from './api-url';

test('buildApiUrl joins the public backend base URL with an API path', () => {
  assert.equal(
    buildApiUrl('/api/auth/login', 'http://localhost:4000/'),
    'http://localhost:4000/api/auth/login',
  );
});

test('buildApiUrl keeps API paths relative when no public base URL is configured', () => {
  assert.equal(buildApiUrl('/api/auth/login', ''), '/api/auth/login');
});

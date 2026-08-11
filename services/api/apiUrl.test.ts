import assert from 'node:assert/strict';
import test from 'node:test';

import { buildApiUrl } from './apiUrl';

test('joins a full versioned API root with a resource path', () => {
  assert.equal(
    buildApiUrl('/auth/login', 'http://localhost:4000/api/v1/'),
    'http://localhost:4000/api/v1/auth/login',
  );
});

test('falls back to same-origin /api/v1', () => {
  assert.equal(buildApiUrl('/auth/login', ''), '/api/v1/auth/login');
});

test('normalizes missing and duplicate slashes', () => {
  assert.equal(
    buildApiUrl('validation/single', 'https://api.example.com/api/v1///'),
    'https://api.example.com/api/v1/validation/single',
  );
});

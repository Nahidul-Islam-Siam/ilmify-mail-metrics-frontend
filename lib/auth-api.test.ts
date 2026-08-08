import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseAuthSession } from './auth-api';

describe('auth API boundary', () => {
  it('parses a complete backend auth session and normalizes its role', () => {
    assert.deepEqual(parseAuthSession({
      accessToken: 'access.jwt',
      refreshToken: 'refresh.jwt',
      user: { id: 'u1', name: 'Siam', email: 'siam@example.com', role: 'client', permissions: ['validate:email'] },
    }), {
      accessToken: 'access.jwt',
      refreshToken: 'refresh.jwt',
      user: { id: 'u1', name: 'Siam', email: 'siam@example.com', role: 'User', role_id: 'user', permissions: ['validate:email'] },
    });
    assert.equal(parseAuthSession({ accessToken: 'only-one-token' }), null);
  });
});

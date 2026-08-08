import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseAuthSession } from './authApi';

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

  it('parses the session from the backend response interceptor data envelope', () => {
    assert.deepEqual(parseAuthSession({
      ok: true,
      status: 200,
      data: {
        accessToken: 'wrapped-access.jwt',
        refreshToken: 'wrapped-refresh.jwt',
        user: {
          id: 'admin-1',
          fullName: 'MailMetric Admin',
          email: 'admin@mailmetric.com',
          role: 'superadmin',
          permissions: ['*'],
        },
      },
    }), {
      accessToken: 'wrapped-access.jwt',
      refreshToken: 'wrapped-refresh.jwt',
      user: {
        id: 'admin-1',
        name: 'MailMetric Admin',
        email: 'admin@mailmetric.com',
        role: 'Super Admin',
        role_id: 'super_admin',
        permissions: ['*'],
      },
    });
  });
});

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { AuthApiError, loginRequest, parseAuthSession } from './authApi';

describe('auth API boundary', () => {
  it('requests login through the versioned API root', async () => {
    const originalFetch = globalThis.fetch;
    let requestUrl = '';
    globalThis.fetch = async (input) => {
      requestUrl = String(input);
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    try {
      await assert.rejects(
        loginRequest('user@example.com', 'wrong-password'),
        AuthApiError,
      );
      assert.equal(requestUrl, '/api/v1/auth/login');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

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

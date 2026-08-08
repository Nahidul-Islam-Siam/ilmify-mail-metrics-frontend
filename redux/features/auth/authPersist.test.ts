import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { rehydrateAuthState, serializeAuthState } from './authPersist';
import type { AuthState } from './authSlice';

const authState: AuthState = {
  user: {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Admin',
    role_id: 'admin',
    permissions: ['user.view'],
  },
  accessToken: 'access-1',
  refreshToken: 'refresh-1',
  loading: true,
  initialized: true,
  error: 'temporary error',
};

describe('auth persistence boundary', () => {
  it('serializes only authenticated session fields', () => {
    assert.deepEqual(serializeAuthState(authState), {
      user: authState.user,
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
    });
  });

  it('rehydrates session fields with fresh transient state', () => {
    assert.deepEqual(rehydrateAuthState({
      user: authState.user,
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
    }), {
      user: authState.user,
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
      loading: false,
      initialized: false,
      error: null,
    });
  });
});

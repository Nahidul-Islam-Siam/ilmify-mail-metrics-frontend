import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import authReducer, {
  initialAuthState,
  loginThunk,
  restoreSessionThunk,
  type AuthState,
} from './authSlice';
import type { AuthSession, AuthTokens } from '../lib/auth-api';

const session: AuthSession = {
  accessToken: 'access-1',
  refreshToken: 'refresh-1',
  user: {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Admin',
    role_id: 'admin',
    permissions: ['user.view'],
  },
};

describe('auth slice', () => {
  it('stores the complete session after login succeeds', () => {
    const next = authReducer(
      initialAuthState,
      loginThunk.fulfilled(session, 'request-1', {
        email: 'admin@example.com',
        password: 'secret',
      }),
    );

    assert.equal(next.accessToken, 'access-1');
    assert.equal(next.refreshToken, 'refresh-1');
    assert.equal(next.user?.role, 'Admin');
    assert.equal(next.loading, false);
    assert.equal(next.error, null);
  });

  it('clears persisted session fields after terminal restoration failure', () => {
    const existingSession: AuthState = {
      ...initialAuthState,
      ...session,
      loading: true,
    };
    const tokens: AuthTokens = session;
    const next = authReducer(
      existingSession,
      restoreSessionThunk.rejected(
        new Error('expired'),
        'request-2',
        tokens,
      ),
    );

    assert.equal(next.user, null);
    assert.equal(next.accessToken, null);
    assert.equal(next.refreshToken, null);
    assert.equal(next.loading, false);
    assert.equal(next.initialized, true);
  });
});

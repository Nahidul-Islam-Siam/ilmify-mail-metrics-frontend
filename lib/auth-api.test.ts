import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  clearStoredTokens,
  parseAuthSession,
  readStoredTokens,
  storeTokens,
} from './auth-api';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

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

  it('writes, reads, and clears both session tokens', () => {
    const storage = new MemoryStorage();
    storeTokens(storage, { accessToken: 'access.jwt', refreshToken: 'refresh.jwt' });
    assert.deepEqual(readStoredTokens(storage), { accessToken: 'access.jwt', refreshToken: 'refresh.jwt' });
    clearStoredTokens(storage);
    assert.equal(readStoredTokens(storage), null);
  });
});

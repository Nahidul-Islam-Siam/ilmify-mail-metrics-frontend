import type { WebStorage } from 'redux-persist';
import type { PersistConfig } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import type { AuthState } from './authSlice';

export type PersistedAuthState = Pick<
  AuthState,
  'user' | 'accessToken' | 'refreshToken'
>;

export function serializeAuthState(state: AuthState): PersistedAuthState {
  return {
    user: state.user,
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
  };
}

export function rehydrateAuthState(state: PersistedAuthState): AuthState {
  return {
    ...state,
    loading: false,
    initialized: false,
    error: null,
  };
}

function createNoopStorage(): WebStorage {
  return {
    getItem: async () => null,
    setItem: async () => undefined,
    removeItem: async () => undefined,
  };
}

const storage = typeof window === 'undefined'
  ? createNoopStorage()
  : createWebStorage('local');

export const authPersistConfig: PersistConfig<AuthState> = {
  key: 'auth',
  version: 1,
  storage,
  whitelist: ['user', 'accessToken', 'refreshToken'],
};

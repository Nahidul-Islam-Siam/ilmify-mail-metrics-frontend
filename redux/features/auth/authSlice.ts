import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  AuthApiError,
  loginRequest,
  logoutRequest,
  profileRequest,
  refreshRequest,
  type AuthSession,
  type AuthTokens,
} from '@/services/api/authApi';
import type { RbacUser } from '@/features/auth/types';

export interface AuthState {
  user: RbacUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  initialized: false,
  error: null,
};

export function selectRestorableTokens(state: AuthState): AuthTokens | null {
  return state.accessToken && state.refreshToken
    ? { accessToken: state.accessToken, refreshToken: state.refreshToken }
    : null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

function messageFrom(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export const loginThunk = createAsyncThunk<
  AuthSession,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    return await loginRequest(email, password);
  } catch (error) {
    return rejectWithValue(messageFrom(error, 'Cannot connect to authentication backend server.'));
  }
});

export const restoreSessionThunk = createAsyncThunk<
  AuthSession,
  AuthTokens,
  { rejectValue: string }
>('auth/restoreSession', async (tokens, { rejectWithValue }) => {
  try {
    const user = await profileRequest(tokens.accessToken);
    return { ...tokens, user };
  } catch (error) {
    if (error instanceof AuthApiError && error.status === 401) {
      try {
        return await refreshRequest(tokens.refreshToken);
      } catch (refreshError) {
        return rejectWithValue(messageFrom(refreshError, 'Session expired.'));
      }
    }
    return rejectWithValue(messageFrom(error, 'Unable to restore session.'));
  }
});

export const logoutThunk = createAsyncThunk<void, AuthTokens | null>(
  'auth/logout',
  async (tokens) => {
    try {
      if (tokens) await logoutRequest(tokens);
    } catch {
      // Local logout must succeed even when the backend is unavailable.
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    clearSession: () => ({ ...initialAuthState, initialized: true }),
    markInitialized: (state) => {
      state.initialized = true;
    },
    updateUser: (state, action: PayloadAction<Partial<RbacUser>>) => {
      if (state.user) state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        Object.assign(state, action.payload, { loading: false, initialized: true, error: null });
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? 'Login failed.';
      })
      .addCase(restoreSessionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreSessionThunk.fulfilled, (state, action) => {
        Object.assign(state, action.payload, { loading: false, initialized: true, error: null });
      })
      .addCase(restoreSessionThunk.rejected, (state, action) => {
        Object.assign(state, {
          user: null,
          accessToken: null,
          refreshToken: null,
          loading: false,
          initialized: true,
          error: action.payload ?? action.error.message ?? 'Unable to restore session.',
        });
      })
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutThunk.fulfilled, () => ({ ...initialAuthState, initialized: true }));
  },
});

export const { clearSession, markInitialized, updateUser } = authSlice.actions;
export default authSlice.reducer;

import { normalizeRole } from './auth-routing';
import { buildApiUrl } from './api-url';
import type { RbacUser } from '../types/rbac';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSession extends AuthTokens {
  user: RbacUser;
}

export class AuthApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? value as Record<string, unknown> : null;
}

export function parseAuthUser(value: unknown): RbacUser | null {
  const record = asRecord(value);
  if (!record) return null;
  const role = normalizeRole(record.role);
  const id = record.id ?? record._id ?? record.sub;
  const name = record.name ?? record.fullName ?? record.companyName;
  if (!role || typeof id !== 'string' || typeof record.email !== 'string') return null;
  return {
    id,
    name: typeof name === 'string' && name ? name : record.email,
    email: record.email,
    role,
    role_id: typeof record.role_id === 'string' ? record.role_id : role.toLowerCase().replaceAll(' ', '_'),
    permissions: Array.isArray(record.permissions)
      ? record.permissions.filter((item): item is string => typeof item === 'string')
      : [],
  };
}

export function parseAuthSession(value: unknown): AuthSession | null {
  const record = asRecord(value);
  if (!record) return null;
  const accessToken = record.accessToken ?? record.token;
  const user = parseAuthUser(record.user);
  if (typeof accessToken !== 'string' || typeof record.refreshToken !== 'string' || !user) return null;
  return { accessToken, refreshToken: record.refreshToken, user };
}

async function responseBody(response: Response): Promise<unknown> {
  try { return await response.json(); } catch { return null; }
}

function errorMessage(body: unknown, fallback: string): string {
  const record = asRecord(body);
  if (typeof record?.message === 'string') return record.message;
  if (Array.isArray(record?.message)) return record.message.filter((item) => typeof item === 'string').join(', ');
  return fallback;
}

export async function loginRequest(email: string, password: string): Promise<AuthSession> {
  const response = await fetch(buildApiUrl('/api/auth/login'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
  const body = await responseBody(response);
  if (!response.ok) throw new AuthApiError(response.status, errorMessage(body, 'Login failed.'));
  const session = parseAuthSession(body);
  if (!session) throw new AuthApiError(502, 'Invalid authentication response.');
  return session;
}

export async function profileRequest(accessToken: string): Promise<RbacUser> {
  const response = await fetch(buildApiUrl('/api/auth/me'), { headers: { Authorization: `Bearer ${accessToken}` } });
  const body = await responseBody(response);
  if (!response.ok) throw new AuthApiError(response.status, errorMessage(body, 'Unable to restore session.'));
  const record = asRecord(body);
  const user = parseAuthUser(record?.user ?? body);
  if (!user) throw new AuthApiError(502, 'Invalid profile response.');
  return user;
}

export async function refreshRequest(refreshToken: string): Promise<AuthSession> {
  const response = await fetch(buildApiUrl('/api/auth/refresh-token'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken }) });
  const body = await responseBody(response);
  if (!response.ok) throw new AuthApiError(response.status, errorMessage(body, 'Session expired.'));
  const session = parseAuthSession(body);
  if (!session) throw new AuthApiError(502, 'Invalid refresh response.');
  return session;
}

export async function logoutRequest(tokens: AuthTokens): Promise<void> {
  const response = await fetch(buildApiUrl('/api/auth/logout'), { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokens.accessToken}` }, body: JSON.stringify({ refreshToken: tokens.refreshToken }) });
  if (!response.ok) throw new AuthApiError(response.status, errorMessage(await responseBody(response), 'Logout failed.'));
}

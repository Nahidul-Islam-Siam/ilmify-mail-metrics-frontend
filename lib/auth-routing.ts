import type { UserRole } from '@/features/auth/types';

const ROLE_MAP: Record<string, UserRole> = {
  superadmin: 'Super Admin',
  'super admin': 'Super Admin',
  admin: 'Admin',
  client: 'User',
  user: 'User',
  sub_user: 'Sub User',
  'sub user': 'Sub User',
};

export function normalizeRole(value: unknown): UserRole | null {
  if (typeof value !== 'string') return null;
  return ROLE_MAP[value.trim().toLowerCase()] ?? null;
}

export function getDefaultDashboard(
  _role: UserRole,
): '/dashboard' {
  return '/dashboard';
}

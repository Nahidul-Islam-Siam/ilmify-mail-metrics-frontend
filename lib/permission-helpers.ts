import type {
  CreatableRole,
  PermissionName,
  RbacUser,
  RoleName,
} from '../types/rbac';

const ROLE_RANKS: Record<RoleName, number> = {
  'Super Admin': 4,
  Admin: 3,
  User: 2,
  'Sub User': 1,
  Guest: 0,
};

export function hasPermissionForUser(
  user: RbacUser | null,
  permission: PermissionName,
): boolean {
  return !!user && (
    user.role === 'Super Admin' || user.permissions.includes(permission)
  );
}

export function canUserCreateRole(
  user: RbacUser | null,
  target: RoleName,
): boolean {
  return !!user && (
    user.role === 'Super Admin' || ROLE_RANKS[target] < ROLE_RANKS[user.role]
  );
}

export function getCreatableRoles(user: RbacUser | null): CreatableRole[] {
  if (!user) return [];
  if (user.role === 'Super Admin') return ['Admin', 'User', 'Sub User'];
  if (user.role === 'Admin') return ['User', 'Sub User'];
  return user.role === 'User' ? ['Sub User'] : [];
}

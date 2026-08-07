import type { ReactNode } from 'react';

export type RoleName = 'Super Admin' | 'Admin' | 'User' | 'Sub User' | 'Guest';
export type UserRole = Exclude<RoleName, 'Guest'>;
export type CreatableRole = Exclude<UserRole, 'Super Admin'>;
export type PermissionName = string;

export interface PermissionDefinition {
  id: string;
  name: PermissionName;
  module: string;
  label: string;
}

export interface RbacUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  role_id: string;
  permissions: PermissionName[];
}

export type AuthResult =
  | { success: true }
  | { success: false; error: string };

export interface PermissionContextValue {
  user: RbacUser | null;
  role: RoleName;
  permissions: PermissionName[];
  token: string | null;
  loading: boolean;
  availablePermissions: PermissionDefinition[];
  hasPermission(permission: PermissionName): boolean;
  canCreateRole(role: RoleName): boolean;
  getAllowedRolesToCreate(): CreatableRole[];
  login(email: string, password: string): Promise<AuthResult>;
  logout(): void;
  switchRoleDemo(role: RoleName): void;
  updateUser(fields: Partial<RbacUser>): void;
}

export interface ChildrenProps {
  children: ReactNode;
}

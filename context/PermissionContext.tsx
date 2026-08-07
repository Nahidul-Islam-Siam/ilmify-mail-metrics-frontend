'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import type {
  AuthResult,
  ChildrenProps,
  CreatableRole,
  PermissionContextValue,
  PermissionDefinition,
  PermissionName,
  RbacUser,
  RoleName,
} from '../types/rbac';

const PermissionContext = createContext<PermissionContextValue | null>(null);

function isRbacUser(value: unknown): value is RbacUser {
  if (!value || typeof value !== 'object') return false;
  const user = value as Record<string, unknown>;
  return typeof user.id === 'string'
    && typeof user.name === 'string'
    && typeof user.email === 'string'
    && typeof user.role === 'string'
    && typeof user.role_id === 'string'
    && Array.isArray(user.permissions)
    && user.permissions.every((permission) => typeof permission === 'string');
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? value as Record<string, unknown> : null;
}

export function PermissionProvider({ children }: ChildrenProps) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<RbacUser | null>({
    id: 'usr-super-admin-1',
    name: 'Super Admin',
    email: 'superadmin@mailmetric.io',
    role: 'Super Admin',
    role_id: 'role-super-admin',
    permissions: [
      'user.create', 'user.view', 'user.edit', 'user.delete',
      'admin.create', 'admin.manage', 'settings.manage',
      'reports.view', 'orders.create', 'orders.view', 'orders.edit'
    ]
  });

  const [availablePermissions] = useState<PermissionDefinition[]>([
    { id: 'perm-user-create', name: 'user.create', module: 'User Management', label: 'Create User' },
    { id: 'perm-user-view', name: 'user.view', module: 'User Management', label: 'View Users' },
    { id: 'perm-user-edit', name: 'user.edit', module: 'User Management', label: 'Edit User' },
    { id: 'perm-user-delete', name: 'user.delete', module: 'User Management', label: 'Delete User' },
    { id: 'perm-admin-create', name: 'admin.create', module: 'Admin Controls', label: 'Create Admin' },
    { id: 'perm-admin-manage', name: 'admin.manage', module: 'Admin Controls', label: 'Platform Oversight' },
    { id: 'perm-settings-manage', name: 'settings.manage', module: 'Settings', label: 'Manage Settings' },
    { id: 'perm-reports-view', name: 'reports.view', module: 'Reports', label: 'View Reports & Analytics' },
    { id: 'perm-orders-create', name: 'orders.create', module: 'Order Management', label: 'Create Order' },
    { id: 'perm-orders-view', name: 'orders.view', module: 'Order Management', label: 'View Orders' },
    { id: 'perm-orders-edit', name: 'orders.edit', module: 'Order Management', label: 'Edit Orders' },
  ]);

  const [loading, setLoading] = useState(false);

  // Sync token from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('mm_token');
      if (storedToken) {
        setToken(storedToken);
        fetchProfile(storedToken);
      }
    }
  }, []);

  const fetchProfile = async (authToken: string): Promise<void> => {
    try {
      const res = await fetch('http://localhost:4000/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data: unknown = await res.json();
        const record = asRecord(data);
        if (record && isRbacUser(record.user)) setUser(record.user);
      }
    } catch (err) {
      console.warn('API sync fallback: Using client RBAC state.');
    }
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data: unknown = await res.json();
      const record = asRecord(data);
      if (res.ok && record && typeof record.token === 'string' && isRbacUser(record.user)) {
        setToken(record.token);
        setUser(record.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('mm_token', record.token);
        }
        setLoading(false);
        return { success: true };
      } else {
        setLoading(false);
        return {
          success: false,
          error: record && typeof record.message === 'string' ? record.message : 'Login failed.',
        };
      }
    } catch (err) {
      setLoading(false);
      return { success: false, error: 'Cannot connect to authentication backend server.' };
    }
  };

  const logout = () => {
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mm_token');
    }
  };

  // Demo Role Switcher for instant UI evaluation
  const switchRoleDemo = (roleName: RoleName): void => {
    let perms: PermissionName[] = [];
    switch (roleName) {
      case 'Super Admin':
        perms = availablePermissions.map(p => p.name);
        setUser({
          id: 'usr-super-admin-1',
          name: 'Super Admin',
          email: 'superadmin@mailmetric.io',
          role: 'Super Admin',
          role_id: 'role-super-admin',
          permissions: perms
        });
        break;

      case 'Admin':
        perms = ['user.create', 'user.view', 'user.edit', 'user.delete', 'admin.create', 'settings.manage', 'reports.view', 'orders.create', 'orders.view', 'orders.edit'];
        setUser({
          id: 'usr-admin-1',
          name: 'Sarah Chen (Admin)',
          email: 'sarah.admin@mailmetric.io',
          role: 'Admin',
          role_id: 'role-admin',
          permissions: perms
        });
        break;

      case 'User':
        perms = ['user.create', 'user.view', 'reports.view', 'orders.create', 'orders.view'];
        setUser({
          id: 'usr-standard-1',
          name: 'Marcus Lee (User)',
          email: 'marcus.user@mailmetric.io',
          role: 'User',
          role_id: 'role-user',
          permissions: perms
        });
        break;

      case 'Sub User':
        perms = ['user.view', 'orders.view'];
        setUser({
          id: 'usr-sub-1',
          name: 'Priya Nair (Sub User)',
          email: 'priya.sub@mailmetric.io',
          role: 'Sub User',
          role_id: 'role-sub-user',
          permissions: perms
        });
        break;

      default:
        break;
    }
  };

  // Permission Check Helper
  const hasPermission = (permissionName: PermissionName): boolean => {
    if (!user) return false;
    if (user.role === 'Super Admin') return true;
    return user.permissions?.includes(permissionName) || false;
  };

  // Role Hierarchy Creation Checker
  const canCreateRole = (targetRoleName: RoleName): boolean => {
    if (!user) return false;
    const rankMap: Record<RoleName, number> = {
      'Super Admin': 4,
      'Admin': 3,
      'User': 2,
      'Sub User': 1,
      'Guest': 0,
    };
    if (user.role === 'Super Admin') return true;
    const myRank = rankMap[user.role] || 0;
    const targetRank = rankMap[targetRoleName] || 0;
    return targetRank < myRank;
  };

  // Allowed target roles array based on logged-in user
  const getAllowedRolesToCreate = (): CreatableRole[] => {
    if (!user) return [];
    if (user.role === 'Super Admin') return ['Admin', 'User', 'Sub User'];
    if (user.role === 'Admin') return ['User', 'Sub User'];
    if (user.role === 'User') return ['Sub User'];
    return [];
  };

  const updateUser = (updatedFields: Partial<RbacUser>): void => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : null));
  };

  return (
    <PermissionContext.Provider value={{
      user,
      role: user?.role || 'Guest',
      permissions: user?.permissions || [],
      token,
      loading,
      availablePermissions,
      hasPermission,
      canCreateRole,
      getAllowedRolesToCreate,
      login,
      logout,
      switchRoleDemo,
      updateUser
    }}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissionContext() {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissionContext must be used within a PermissionProvider');
  }
  return context;
}

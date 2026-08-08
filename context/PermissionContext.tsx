'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getDefaultDashboard, normalizeRole } from '../lib/auth-routing';
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

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : null;
}

function parseUser(value: unknown): RbacUser | null {
  const record = asRecord(value);
  if (!record) return null;
  const role = normalizeRole(record.role);
  const id = record.id ?? record._id ?? record.sub;
  const name = record.name ?? record.fullName ?? record.companyName;
  if (!role || typeof id !== 'string' || typeof record.email !== 'string') {
    return null;
  }
  const permissions = Array.isArray(record.permissions)
    ? record.permissions.filter((item): item is string => typeof item === 'string')
    : [];
  return {
    id,
    name: typeof name === 'string' && name ? name : record.email,
    email: record.email,
    role,
    role_id: typeof record.role_id === 'string' ? record.role_id : role.toLowerCase().replaceAll(' ', '_'),
    permissions,
  };
}

const AVAILABLE_PERMISSIONS: PermissionDefinition[] = [
  { id: 'perm-user-create', name: 'user.create', module: 'User Management', label: 'Create User' },
  { id: 'perm-user-view', name: 'user.view', module: 'User Management', label: 'View Users' },
  { id: 'perm-user-edit', name: 'user.edit', module: 'User Management', label: 'Edit User' },
  { id: 'perm-user-delete', name: 'user.delete', module: 'User Management', label: 'Delete User' },
  { id: 'perm-admin-manage', name: 'admin.manage', module: 'Admin Controls', label: 'Platform Oversight' },
  { id: 'perm-settings-manage', name: 'settings.manage', module: 'Settings', label: 'Manage Settings' },
  { id: 'perm-reports-view', name: 'reports.view', module: 'Reports', label: 'View Reports & Analytics' },
];

export function PermissionProvider({ children }: ChildrenProps) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<RbacUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('mm_token');
    if (!storedToken) {
      setLoading(false);
      return;
    }
    setToken(storedToken);
    void fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Session expired');
        const body: unknown = await response.json();
        const record = asRecord(body);
        const profile = parseUser(record?.user ?? body);
        if (!profile) throw new Error('Invalid profile');
        setUser(profile);
      })
      .catch(() => {
        localStorage.removeItem('mm_token');
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string): Promise<AuthResult> {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const body: unknown = await response.json();
      const record = asRecord(body);
      const authToken = record?.token ?? record?.accessToken;
      const profile = parseUser(record?.user);
      if (!response.ok || typeof authToken !== 'string' || !profile) {
        return { success: false, error: typeof record?.message === 'string' ? record.message : 'Login failed.' };
      }
      localStorage.setItem('mm_token', authToken);
      setToken(authToken);
      setUser(profile);
      return { success: true, destination: getDefaultDashboard(profile.role) };
    } catch {
      return { success: false, error: 'Cannot connect to authentication backend server.' };
    } finally {
      setLoading(false);
    }
  }

  function logout(): void {
    localStorage.removeItem('mm_token');
    setToken(null);
    setUser(null);
  }

  function hasPermission(permission: PermissionName): boolean {
    return !!user && (user.role === 'Super Admin' || user.permissions.includes(permission));
  }

  function canCreateRole(target: RoleName): boolean {
    if (!user) return false;
    const ranks: Record<RoleName, number> = { 'Super Admin': 4, Admin: 3, User: 2, 'Sub User': 1, Guest: 0 };
    return user.role === 'Super Admin' || ranks[target] < ranks[user.role];
  }

  function getAllowedRolesToCreate(): CreatableRole[] {
    if (!user) return [];
    if (user.role === 'Super Admin') return ['Admin', 'User', 'Sub User'];
    if (user.role === 'Admin') return ['User', 'Sub User'];
    return user.role === 'User' ? ['Sub User'] : [];
  }

  return (
    <PermissionContext.Provider value={{
      user,
      role: user?.role ?? 'Guest',
      permissions: user?.permissions ?? [],
      token,
      loading,
      availablePermissions: AVAILABLE_PERMISSIONS,
      hasPermission,
      canCreateRole,
      getAllowedRolesToCreate,
      login,
      logout,
      updateUser: (fields) => setUser((current) => current ? { ...current, ...fields } : null),
    }}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissionContext(): PermissionContextValue {
  const context = useContext(PermissionContext);
  if (!context) throw new Error('usePermissionContext must be used within a PermissionProvider');
  return context;
}

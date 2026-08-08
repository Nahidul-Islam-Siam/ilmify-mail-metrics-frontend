'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getDefaultDashboard } from '../lib/auth-routing';
import {
  AuthApiError,
  clearStoredTokens,
  loginRequest,
  logoutRequest,
  profileRequest,
  readStoredTokens,
  refreshRequest,
  storeTokens,
} from '../lib/auth-api';
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
    const storedTokens = readStoredTokens(localStorage);
    if (!storedTokens) {
      setLoading(false);
      return;
    }
    setToken(storedTokens.accessToken);
    void (async () => {
      try {
        setUser(await profileRequest(storedTokens.accessToken));
      } catch (error) {
        if (!(error instanceof AuthApiError) || error.status !== 401) throw error;
        const refreshed = await refreshRequest(storedTokens.refreshToken);
        storeTokens(localStorage, refreshed);
        setToken(refreshed.accessToken);
        setUser(refreshed.user);
      }
    })().catch(() => {
      clearStoredTokens(localStorage);
      setToken(null);
      setUser(null);
    }).finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string): Promise<AuthResult> {
    setLoading(true);
    try {
      const session = await loginRequest(email, password);
      storeTokens(localStorage, session);
      setToken(session.accessToken);
      setUser(session.user);
      return { success: true, destination: getDefaultDashboard(session.user.role) };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Cannot connect to authentication backend server.' };
    } finally {
      setLoading(false);
    }
  }

  async function logout(): Promise<void> {
    const storedTokens = readStoredTokens(localStorage);
    try {
      if (storedTokens) await logoutRequest(storedTokens);
    } finally {
      clearStoredTokens(localStorage);
      setToken(null);
      setUser(null);
    }
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

import { getDefaultDashboard } from '@/lib/auth-routing';
import {
  authMarkerCookie,
  clearAuthMarkerCookie,
} from '@/features/auth/authMarker';
import {
  canUserCreateRole,
  getCreatableRoles,
  hasPermissionForUser,
} from '@/features/auth/permissionHelpers';
import {
  loginThunk,
  logoutThunk,
  restoreSessionThunk,
  selectRestorableTokens,
  updateUser,
} from '@/redux/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import type {
  PermissionContextValue,
  PermissionDefinition,
} from '@/features/auth/types';

const AVAILABLE_PERMISSIONS: PermissionDefinition[] = [
  { id: 'perm-user-create', name: 'user.create', module: 'User Management', label: 'Create User' },
  { id: 'perm-user-view', name: 'user.view', module: 'User Management', label: 'View Users' },
  { id: 'perm-user-edit', name: 'user.edit', module: 'User Management', label: 'Edit User' },
  { id: 'perm-user-delete', name: 'user.delete', module: 'User Management', label: 'Delete User' },
  { id: 'perm-admin-manage', name: 'admin.manage', module: 'Admin Controls', label: 'Platform Oversight' },
  { id: 'perm-settings-manage', name: 'settings.manage', module: 'Settings', label: 'Manage Settings' },
  { id: 'perm-reports-view', name: 'reports.view', module: 'Reports', label: 'View Reports & Analytics' },
];

export function usePermission(): PermissionContextValue {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const { user } = auth;

  return {
    user,
    role: user?.role ?? 'Guest',
    permissions: user?.permissions ?? [],
    token: auth.accessToken,
    loading: auth.loading || !auth.initialized,
    availablePermissions: AVAILABLE_PERMISSIONS,
    hasPermission: (permission) => hasPermissionForUser(user, permission),
    canCreateRole: (role) => canUserCreateRole(user, role),
    getAllowedRolesToCreate: () => getCreatableRoles(user),
    login: async (email, password) => {
      try {
        const session = await dispatch(loginThunk({ email, password })).unwrap();
        document.cookie = authMarkerCookie(process.env.NODE_ENV === 'production');
        return { success: true, destination: getDefaultDashboard(session.user.role) };
      } catch (error) {
        return {
          success: false,
          error: typeof error === 'string'
            ? error
            : error instanceof Error
              ? error.message
              : 'Cannot connect to authentication backend server.',
        };
      }
    },
    logout: async () => {
      try {
        await dispatch(logoutThunk(selectRestorableTokens(auth))).unwrap();
      } finally {
        document.cookie = clearAuthMarkerCookie(process.env.NODE_ENV === 'production');
      }
    },
    refreshAccessToken: async () => {
      const tokens = selectRestorableTokens(auth);
      if (!tokens) return null;
      try {
        return (await dispatch(restoreSessionThunk(tokens)).unwrap()).accessToken;
      } catch {
        return null;
      }
    },
    updateUser: (fields) => {
      dispatch(updateUser(fields));
    },
  };
}

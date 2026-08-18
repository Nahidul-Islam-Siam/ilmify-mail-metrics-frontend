import type { PermissionName, RoleName } from '@/features/auth/types';

export interface DashboardNavigationItem {
  label: string;
  href: string;
  permission?: PermissionName;
  roles?: RoleName[];
  preview?: boolean;
}

export const USER_NAVIGATION: DashboardNavigationItem[] = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Single validation', href: '/dashboard/validation/single' },
  { label: 'Bulk validation', href: '/dashboard/validation/bulk' },
  {
    label: 'Sheet validation',
    href: '/dashboard/validation/sheet',
    preview: true,
  },
  { label: 'Valid Emails', href: '/dashboard/valid-emails' },
  { label: 'Validation history', href: '/dashboard/history', preview: true },
  { label: 'Email verification', href: '/dashboard/verify', preview: true },
  { label: 'Team', href: '/dashboard/team', preview: true },
  { label: 'Subscription', href: '/dashboard/subscription', preview: true },
  { label: 'Invoices', href: '/dashboard/invoices', preview: true },
  { label: 'Invoice detail', href: '/dashboard/invoice', preview: true },
  { label: 'API management', href: '/dashboard/api', preview: true },
  { label: 'Integrations', href: '/dashboard/integrations', preview: true },
  { label: 'AI insights', href: '/dashboard/ai', preview: true },
  {
    label: 'Admin panel',
    href: '/dashboard/admin',
    roles: ['Admin', 'Super Admin'],
    preview: true,
  },
  {
    label: 'User management',
    href: '/dashboard/users',
    roles: ['Admin', 'Super Admin'],
    preview: true,
  },
  {
    label: 'Disposable domains',
    href: '/dashboard/disposable',
    roles: ['Admin', 'Super Admin'],
    preview: true,
  },
  {
    label: 'Disposable providers',
    href: '/dashboard/disposable/providers',
    roles: ['Admin', 'Super Admin'],
    preview: true,
  },
  {
    label: 'Import disposable domains',
    href: '/dashboard/disposable/import',
    roles: ['Admin', 'Super Admin'],
    preview: true,
  },
  {
    label: 'Analytics',
    href: '/dashboard/analytics',
    roles: ['Admin', 'Super Admin'],
    preview: true,
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    permission: 'settings.manage',
  },
  {
    label: 'Super Admin area',
    href: '/super-admin',
    roles: ['Super Admin'],
  },
];

export function getUserNavigation(
  role: RoleName,
  permissions: PermissionName[] = [],
): DashboardNavigationItem[] {
  return USER_NAVIGATION.filter((item) => {
    const roleAllowed = !item.roles || item.roles.includes(role);
    const permissionAllowed =
      !item.permission ||
      role === 'Super Admin' ||
      permissions.includes(item.permission);

    return roleAllowed && permissionAllowed;
  });
}

export const SUPER_ADMIN_NAVIGATION: DashboardNavigationItem[] = [
  { label: 'Platform overview', href: '/super-admin' },
  ...USER_NAVIGATION.filter(({ href, roles }) =>
    href !== '/super-admin' && (!roles || roles.includes('Super Admin')),
  ),
];

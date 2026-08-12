export interface DashboardNavigationItem {
  label: string;
  href: string;
}

export const USER_NAVIGATION: DashboardNavigationItem[] = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Single validation', href: '/dashboard/validation/single' },
  { label: 'Bulk validation', href: '/dashboard/validation/bulk' },
  { label: 'Valid Emails', href: '/dashboard/valid-emails' },
  // { label: 'Validation history', href: '/dashboard/history' },
  // { label: 'Subscription', href: '/dashboard/subscription' },
  // { label: 'Settings', href: '/dashboard/settings' },
  // { label: 'Super Admin area', href: '/super-admin' },
];

export const SUPER_ADMIN_NAVIGATION: DashboardNavigationItem[] = [
  { label: 'Platform overview', href: '/super-admin' },
  { label: 'User management', href: '/dashboard/users' },
  { label: 'Disposable domains', href: '/dashboard/disposable' },
  { label: 'Analytics', href: '/dashboard/analytics' },
  { label: 'Settings', href: '/dashboard/settings' },
  { label: 'Single validation', href: '/dashboard/validation/single' },
  { label: 'Bulk validation', href: '/dashboard/validation/bulk' },
  { label: 'User dashboard', href: '/dashboard' },
];

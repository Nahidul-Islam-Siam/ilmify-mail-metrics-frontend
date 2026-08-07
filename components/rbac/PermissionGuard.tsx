'use client';

import { usePermission } from '../../hooks/usePermission';
import type { ReactNode } from 'react';
import type { PermissionName } from '../../types/rbac';

interface PermissionGuardProps {
  permission?: PermissionName;
  permissions?: PermissionName[];
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

export default function PermissionGuard({ permission, permissions, requireAll = false, fallback = null, children }: PermissionGuardProps) {
  const { hasPermission, role } = usePermission();

  if (role === 'Super Admin') {
    return <>{children}</>;
  }

  let isAllowed = false;

  if (permission) {
    isAllowed = hasPermission(permission);
  } else if (permissions && Array.isArray(permissions)) {
    if (requireAll) {
      isAllowed = permissions.every(p => hasPermission(p));
    } else {
      isAllowed = permissions.some(p => hasPermission(p));
    }
  } else {
    isAllowed = true;
  }

  if (!isAllowed) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}

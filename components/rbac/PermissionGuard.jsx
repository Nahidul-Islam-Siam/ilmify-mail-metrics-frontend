'use client';

import { usePermission } from '../../hooks/usePermission';

export default function PermissionGuard({ permission, permissions, requireAll = false, fallback = null, children }) {
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

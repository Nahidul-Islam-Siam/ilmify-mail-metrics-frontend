import { usePermissionContext } from '../context/PermissionContext';
import type { PermissionContextValue } from '../types/rbac';

export function usePermission(): PermissionContextValue {
  return usePermissionContext();
}

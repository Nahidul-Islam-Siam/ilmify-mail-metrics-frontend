import { usePermissionContext } from '../context/PermissionContext';

export function usePermission() {
  return usePermissionContext();
}

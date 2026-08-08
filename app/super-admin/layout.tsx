import type { ReactNode } from 'react';
import SuperAdminLayoutShell from '@/components/layouts/SuperAdminLayout';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return <SuperAdminLayoutShell>{children}</SuperAdminLayoutShell>;
}

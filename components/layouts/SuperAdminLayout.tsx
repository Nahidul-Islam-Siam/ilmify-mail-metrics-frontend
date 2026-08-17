'use client';

import type { ReactNode } from 'react';
import AuthenticatedRoute from '@/components/rbac/AuthenticatedRoute';
import Topbar from '@/components/dashboard/Topbar';
import SuperAdminSidebar from '@/components/super-admin/SuperAdminSidebar';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return <AuthenticatedRoute><div style={{ minHeight: '100vh', display: 'flex', background: '#F8FAFC' }}><SuperAdminSidebar /><div style={{ flex: 1, minWidth: 0 }}><Topbar menuOpen={false} /><main style={{ padding: '30px 34px' }}>{children}</main></div></div></AuthenticatedRoute>;
}

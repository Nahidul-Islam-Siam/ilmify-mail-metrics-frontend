'use client';

import type { ReactNode } from 'react';
import AuthenticatedRoute from '../rbac/AuthenticatedRoute';
import Topbar from '../dashboard/Topbar';
import SuperAdminSidebar from './SuperAdminSidebar';

export default function SuperAdminShell({ children }: { children: ReactNode }) {
  return <AuthenticatedRoute><div style={{ minHeight: '100vh', display: 'flex', background: '#F8FAFC' }}><SuperAdminSidebar /><div style={{ flex: 1, minWidth: 0 }}><Topbar onMenuClick={() => undefined} /><main style={{ padding: '30px 34px' }}>{children}</main></div></div></AuthenticatedRoute>;
}

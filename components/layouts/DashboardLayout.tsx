'use client';

import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import type { ChildrenProps } from '@/features/auth/types';
import AuthenticatedRoute from '@/components/rbac/AuthenticatedRoute';
import styles from './DashboardLayout.module.css';
import { useDashboardMobileMenu } from './useDashboardMobileMenu';

export default function DashboardLayout({ children }: ChildrenProps) {
  const menu = useDashboardMobileMenu();

  return (
    <AuthenticatedRoute>
      <div className={styles.shell}>
        <div
          className={`${styles.sidebarSlot} ${menu.isOpen ? styles.sidebarSlotOpen : ''}`}
        >
          <Sidebar isOpen={menu.isOpen} />
        </div>

        <button
          aria-label="Close navigation menu"
          className={`${styles.backdrop} ${menu.isOpen ? styles.backdropOpen : ''}`}
          onClick={menu.close}
          type="button"
        />

        <div className={styles.mainColumn}>
          <Topbar onMenuClick={menu.toggle} />
          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </AuthenticatedRoute>
  );
}

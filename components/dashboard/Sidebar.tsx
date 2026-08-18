'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getUserNavigation } from '../../lib/dashboard-navigation';
import { usePermission } from '@/features/auth/usePermission';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();
  const { role, user } = usePermission();

  return (
    <aside
      aria-label="Primary navigation"
      className={styles.sidebar}
      data-open={isOpen}
      id="dashboard-navigation"
    >
      <Link className={styles.brand} href="/dashboard">
        MailMetric
      </Link>
      <p className={styles.sectionLabel}>User workspace</p>
      <nav className={styles.navigation}>
        {getUserNavigation(role).map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              aria-current={active ? 'page' : undefined}
              className={`${styles.navLink} ${active ? styles.active : ''}`}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className={styles.identity}>
        <strong className={styles.identityName}>{user?.name}</strong>
        <span className={styles.identityEmail}>{user?.email}</span>
      </div>
    </aside>
  );
}

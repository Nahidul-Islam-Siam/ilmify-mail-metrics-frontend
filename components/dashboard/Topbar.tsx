'use client';

import { useRouter } from 'next/navigation';
import { usePermission } from '@/features/auth/usePermission';
import type { RoleName } from '@/features/auth/types';
import styles from './Topbar.module.css';

interface TopbarProps {
  menuOpen: boolean;
  onMenuClick?(): void;
}

const roleBadgeClass: Record<RoleName, string> = {
  'Super Admin': styles.superAdmin,
  Admin: styles.admin,
  User: styles.user,
  'Sub User': styles.neutral,
  Guest: styles.neutral,
};

export default function Topbar({ menuOpen, onMenuClick }: TopbarProps) {
  const { user, role, logout } = usePermission();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <header className={styles.topbar}>
      {onMenuClick ? (
        <button
          aria-controls="dashboard-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className={styles.menuButton}
          onClick={onMenuClick}
          type="button"
        >
          <svg
            aria-hidden="true"
            className={styles.menuIcon}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M4 6h16M4 12h16M4 18h16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ) : null}

      <div className={styles.search}>
        <svg
          aria-hidden="true"
          className={styles.searchIcon}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          aria-label="Search workspace"
          className={styles.searchInput}
          placeholder="Search emails, lists, or docs..."
          type="search"
        />
      </div>

      <div className={styles.controls}>
        <div className={styles.credits}>
          <span className={styles.creditsValue}>41.2k</span>
          <span className={styles.creditsLabel}>Credits</span>
        </div>

        <button className={styles.logout} onClick={handleLogout} type="button">
          Logout
        </button>

        <div className={styles.profile}>
          <div aria-hidden="true" className={styles.avatar}>
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className={styles.profileText}>
            <strong className={styles.profileName}>{user?.name || 'User'}</strong>
            <span className={`${styles.roleBadge} ${roleBadgeClass[role]}`}>
              {role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

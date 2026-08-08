'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SUPER_ADMIN_NAVIGATION } from '../../lib/dashboard-navigation';
import { usePermission } from '@/features/auth/usePermission';

export default function SuperAdminSidebar() {
  const pathname = usePathname();
  const { user } = usePermission();
  return (
    <aside style={{ width: 270, minHeight: '100vh', color: '#E2E8F0', background: '#111827', padding: 20, boxSizing: 'border-box' }}>
      <Link href="/super-admin" style={{ display: 'block', color: '#fff', fontSize: 20, fontWeight: 800, textDecoration: 'none', margin: '6px 8px 4px' }}>MailMetric</Link>
      <div style={{ color: '#A78BFA', fontSize: 11, fontWeight: 800, margin: '0 8px 28px' }}>SUPER ADMIN</div>
      <nav style={{ display: 'grid', gap: 5 }}>
        {SUPER_ADMIN_NAVIGATION.map((item) => {
          const active = pathname === item.href;
          return <Link key={item.href} href={item.href} style={{ padding: '10px 12px', borderRadius: 9, color: active ? '#fff' : '#CBD5E1', background: active ? '#6D28D9' : 'transparent', textDecoration: 'none', fontSize: 13, fontWeight: active ? 700 : 500 }}>{item.label}</Link>;
        })}
      </nav>
      <div style={{ marginTop: 28, padding: 12, borderTop: '1px solid #334155', fontSize: 12 }}><strong style={{ display: 'block', color: '#fff' }}>{user?.name}</strong>{user?.email}</div>
    </aside>
  );
}

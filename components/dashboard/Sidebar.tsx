'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { USER_NAVIGATION } from '../../lib/dashboard-navigation';
import { usePermission } from '@/features/auth/usePermission';

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();
  const { user } = usePermission();
  return (
    <aside style={{ width: 264, minHeight: '100vh', background: '#fff', borderRight: '1px solid #EAECF0', padding: 18, boxSizing: 'border-box', display: isOpen ? 'block' : undefined }}>
      <Link href="/dashboard" style={{ display: 'block', color: '#101828', fontSize: 20, fontWeight: 800, textDecoration: 'none', margin: '8px 8px 30px' }}>MailMetric</Link>
      <div style={{ color: '#98A2B3', fontSize: 11, fontWeight: 700, margin: '0 10px 8px' }}>USER WORKSPACE</div>
      <nav style={{ display: 'grid', gap: 5 }}>
        {USER_NAVIGATION.map((item) => {
          const active = pathname === item.href;
          return <Link key={item.href} href={item.href} style={{ padding: '10px 12px', borderRadius: 9, textDecoration: 'none', fontSize: 13, fontWeight: active ? 700 : 500, color: active ? '#7C3AED' : '#475467', background: active ? '#F4F3FF' : 'transparent' }}>{item.label}</Link>;
        })}
      </nav>
      <div style={{ marginTop: 28, padding: 12, borderTop: '1px solid #EAECF0', color: '#667085', fontSize: 12 }}>
        <strong style={{ display: 'block', color: '#101828' }}>{user?.name}</strong>{user?.email}
      </div>
    </aside>
  );
}

import Link from 'next/link';
import { SUPER_ADMIN_NAVIGATION } from '../../lib/dashboard-navigation';

export default function SuperAdminPage() {
  const cards = SUPER_ADMIN_NAVIGATION.filter(({ href }) => !['/super-admin', '/dashboard'].includes(href));
  return <section><p style={{ color: '#7C3AED', fontWeight: 800, marginBottom: 5 }}>PLATFORM CONTROL</p><h1 style={{ marginTop: 0, color: '#101828' }}>Super Admin Dashboard</h1><p style={{ color: '#667085', marginBottom: 28 }}>Manage MailMetric and open shared validation tools.</p><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>{cards.map((card) => <Link key={card.href} href={card.href} style={{ padding: 22, borderRadius: 14, border: '1px solid #EAECF0', background: '#fff', textDecoration: 'none', color: '#101828', fontWeight: 700, boxShadow: '0 4px 14px rgba(16,24,40,.04)' }}>{card.label}<span style={{ display: 'block', color: '#7C3AED', fontSize: 12, marginTop: 12 }}>Open →</span></Link>)}</div></section>;
}

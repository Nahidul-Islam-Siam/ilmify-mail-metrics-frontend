'use client';

import Link from 'next/link';
import Icon from '@/components/ui/Icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/features/auth/usePermission';

export default function Navbar() {
  const { user, loading, logout } = usePermission();
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setProfileOpen(false);
    await logout();
    router.replace('/');
    router.refresh();
  }

  return (
    <div className="wrap nav">
      <div className="nav-inner">
        <Link className="brand" href="/">
          <span className="mk"><Icon name="logo" /></span>
          MailMetric
        </Link>
        <nav className="nav-menu">
          <Link href="/" className="active">Home</Link>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#how">How It Works</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="nav-right">
          {loading ? (
            <span aria-label="Restoring session" style={{ width: 112, height: 38, borderRadius: 20, background: 'rgba(255,255,255,.12)' }} />
          ) : user ? (
            <>
              <Link href="/dashboard" className="btn-pill">Dashboard</Link>
              <div style={{ position: 'relative' }}>
                <button type="button" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen} aria-label="Open account menu" style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid rgba(255,255,255,.45)', background: '#7C3AED', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </button>
                {profileOpen && (
                  <div style={{ position: 'absolute', right: 0, top: 48, width: 190, padding: 8, borderRadius: 12, background: '#fff', border: '1px solid #EAECF0', boxShadow: '0 14px 35px rgba(15,23,42,.18)', zIndex: 100 }}>
                    <div style={{ padding: '8px 10px', color: '#101828', fontSize: 13, borderBottom: '1px solid #EAECF0', marginBottom: 5 }}><strong>{user.name}</strong><small style={{ display: 'block', color: '#667085', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</small></div>
                    <Link href="/dashboard" style={{ display: 'block', padding: '9px 10px', color: '#344054', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Dashboard</Link>
                    <button type="button" onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '9px 10px', color: '#B42318', background: 'transparent', border: 0, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="login">Log In</Link>
              <Link href="/login" className="btn-pill">Get Started</Link>
            </>
          )}
          <button className="hamb" aria-label="Menu">
            <svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

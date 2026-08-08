'use client';
import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import type { ChildrenProps } from '@/features/auth/types';
import AuthenticatedRoute from '@/components/rbac/AuthenticatedRoute';

export default function DashboardLayout({ children }: ChildrenProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return <AuthenticatedRoute>
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      background: '#F8FAFC',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      {/* Left Sidebar - Fixed 264px Width */}
      <Sidebar isOpen={mobileMenuOpen} />
      
      {/* Right Main Column */}
      <div style={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        background: '#F8FAFC'
      }}>
        <Topbar onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main style={{
          flex: 1,
          padding: '28px 32px',
          background: '#F8FAFC',
          minWidth: 0,
          boxSizing: 'border-box'
        }}>
          {children}
        </main>
      </div>
    </div>
  </AuthenticatedRoute>;
}

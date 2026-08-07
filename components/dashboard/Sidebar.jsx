'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { usePermission } from '../../hooks/usePermission';

export default function Sidebar({ isOpen }) {
  const pathname = usePathname() || '';
  const [validationOpen, setValidationOpen] = useState(false);
  const { hasPermission, role } = usePermission();

  useEffect(() => {
    if (pathname && pathname.includes('validation')) {
      setValidationOpen(true);
    }
  }, [pathname]);

  const isActive = (path) => pathname === path;

  return (
    <aside 
      className={`sidebar ${isOpen ? 'open' : ''}`} 
      id="sidebar"
      style={{
        width: '264px',
        minWidth: '264px',
        maxWidth: '264px',
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        background: '#FFFFFF',
        borderRight: '1px solid #EAECF0',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 60,
        boxSizing: 'border-box',
        fontFamily: "'Inter', system-ui, sans-serif"
      }}
    >
      {/* Brand Header */}
      <Link 
        href="/" 
        className="sidebar-brand" 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '20px 20px 16px',
          borderBottom: '1px solid #F2F4F7',
          width: '100%',
          boxSizing: 'border-box',
          textDecoration: 'none'
        }}
      >
        <div className="logo-mark" style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #7C3AED, #9333EA)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
          flexShrink: 0
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px', flexShrink: 0 }}>
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: '16px', color: '#101828', fontFamily: "'Sora', sans-serif", letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            MailMetric
          </div>
          <div style={{ fontSize: '11px', color: '#667085', fontWeight: 500, whiteSpace: 'nowrap' }}>
            Email Intelligence
          </div>
        </div>
      </Link>

      {/* Navigation List */}
      <nav className="sidebar-nav" style={{
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        flex: 1,
        overflowY: 'auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div className="nav-label" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: '#98A2B3', padding: '0 8px 4px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          MAIN MENU
        </div>

        {/* Dashboard Link - Always Available */}
        <Link href="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`} style={{
          display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', width: '100%', boxSizing: 'border-box',
          background: isActive('/dashboard') ? '#F4F3FF' : 'transparent',
          color: isActive('/dashboard') ? '#7C3AED' : '#475467',
          fontWeight: isActive('/dashboard') ? 700 : 500,
          fontSize: '13.5px', textDecoration: 'none'
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', minWidth: '18px', minHeight: '18px', flexShrink: 0 }}>
            <rect x="3" y="3" width="7" height="7" rx="2" />
            <rect x="14" y="3" width="7" height="7" rx="2" />
            <rect x="14" y="14" width="7" height="7" rx="2" />
            <rect x="3" y="14" width="7" height="7" rx="2" />
          </svg>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Dashboard</span>
        </Link>

        {/* Validation Tools Dropdown */}
        <div 
          className={`nav-item ${pathname && pathname.includes('validation') ? 'active' : ''}`}
          aria-expanded={validationOpen}
          onClick={() => setValidationOpen(!validationOpen)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: '10px', width: '100%', boxSizing: 'border-box',
            background: pathname && pathname.includes('validation') ? '#F4F3FF' : 'transparent',
            color: pathname && pathname.includes('validation') ? '#7C3AED' : '#475467',
            fontWeight: pathname && pathname.includes('validation') ? 700 : 500,
            fontSize: '13.5px', cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', minWidth: '18px', minHeight: '18px', flexShrink: 0 }}>
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Validation Tools</span>
          </div>
          <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '14px', height: '14px', minWidth: '14px', minHeight: '14px', flexShrink: 0, transform: validationOpen ? 'rotate(90deg)' : 'none', transition: '0.2s' }}>
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {validationOpen && (
          <div className="submenu open" style={{ paddingLeft: '36px', display: 'flex', flexDirection: 'column', gap: '4px', margin: '2px 0 6px', width: '100%', boxSizing: 'border-box' }}>
            <Link href="/dashboard/validation/single" className={`sub-item ${isActive('/dashboard/validation/single') ? 'active' : ''}`} style={{ fontSize: '13px', color: isActive('/dashboard/validation/single') ? '#7C3AED' : '#667085', fontWeight: isActive('/dashboard/validation/single') ? 700 : 400, textDecoration: 'none', padding: '4px 0', whiteSpace: 'nowrap' }}>
              Single Check
            </Link>
            <Link href="/dashboard/validation/bulk" className={`sub-item ${isActive('/dashboard/validation/bulk') ? 'active' : ''}`} style={{ fontSize: '13px', color: isActive('/dashboard/validation/bulk') ? '#7C3AED' : '#667085', fontWeight: isActive('/dashboard/validation/bulk') ? 700 : 400, textDecoration: 'none', padding: '4px 0', whiteSpace: 'nowrap' }}>
              Bulk Upload
            </Link>
            <Link href="/dashboard/verify" className={`sub-item ${isActive('/dashboard/verify') ? 'active' : ''}`} style={{ fontSize: '13px', color: isActive('/dashboard/verify') ? '#7C3AED' : '#667085', fontWeight: isActive('/dashboard/verify') ? 700 : 400, textDecoration: 'none', padding: '4px 0', whiteSpace: 'nowrap' }}>
              ✉️ Email OTP Verify
            </Link>
            <Link href="/dashboard/disposable" className={`sub-item ${isActive('/dashboard/disposable') ? 'active' : ''}`} style={{ fontSize: '13px', color: isActive('/dashboard/disposable') ? '#7C3AED' : '#667085', fontWeight: isActive('/dashboard/disposable') ? 700 : 400, textDecoration: 'none', padding: '4px 0', whiteSpace: 'nowrap' }}>
              🚫 Disposable Blocklist
            </Link>
            <Link href="/dashboard/disposable/import" className={`sub-item ${isActive('/dashboard/disposable/import') ? 'active' : ''}`} style={{ fontSize: '13px', color: isActive('/dashboard/disposable/import') ? '#7C3AED' : '#667085', fontWeight: isActive('/dashboard/disposable/import') ? 700 : 400, textDecoration: 'none', padding: '4px 0', whiteSpace: 'nowrap' }}>
              📤 Bulk Import Domains
            </Link>
            <Link href="/dashboard/disposable/providers" className={`sub-item ${isActive('/dashboard/disposable/providers') ? 'active' : ''}`} style={{ fontSize: '13px', color: isActive('/dashboard/disposable/providers') ? '#7C3AED' : '#667085', fontWeight: isActive('/dashboard/disposable/providers') ? 700 : 400, textDecoration: 'none', padding: '4px 0', whiteSpace: 'nowrap' }}>
              🏛️ Provider Overview
            </Link>
            <Link href="/dashboard/history" className={`sub-item ${isActive('/dashboard/history') ? 'active' : ''}`} style={{ fontSize: '13px', color: isActive('/dashboard/history') ? '#7C3AED' : '#667085', fontWeight: isActive('/dashboard/history') ? 700 : 400, textDecoration: 'none', padding: '4px 0', whiteSpace: 'nowrap' }}>
              📜 Validation History
            </Link>
          </div>
        )}

        <Link href="/dashboard/api" className={`nav-item ${isActive('/dashboard/api') ? 'active' : ''}`} style={{
          display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', width: '100%', boxSizing: 'border-box',
          background: isActive('/dashboard/api') ? '#F4F3FF' : 'transparent',
          color: isActive('/dashboard/api') ? '#7C3AED' : '#475467',
          fontWeight: isActive('/dashboard/api') ? 700 : 500,
          fontSize: '13.5px', textDecoration: 'none'
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', minWidth: '18px', minHeight: '18px', flexShrink: 0 }}>
            <path d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>API & Keys</span>
        </Link>

        {/* Analytics Link - Filtered by reports.view */}
        {(role === 'Super Admin' || hasPermission('reports.view')) && (
          <Link href="/dashboard/analytics" className={`nav-item ${isActive('/dashboard/analytics') ? 'active' : ''}`} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', width: '100%', boxSizing: 'border-box',
            background: isActive('/dashboard/analytics') ? '#F4F3FF' : 'transparent',
            color: isActive('/dashboard/analytics') ? '#7C3AED' : '#475467',
            fontWeight: isActive('/dashboard/analytics') ? 700 : 500,
            fontSize: '13.5px', textDecoration: 'none'
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', minWidth: '18px', minHeight: '18px', flexShrink: 0 }}>
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Analytics</span>
          </Link>
        )}

        {/* AI Insights Link */}
        <Link href="/dashboard/ai" className={`nav-item ${isActive('/dashboard/ai') ? 'active' : ''}`} style={{
          display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', width: '100%', boxSizing: 'border-box',
          background: isActive('/dashboard/ai') ? '#F4F3FF' : 'transparent',
          color: isActive('/dashboard/ai') ? '#7C3AED' : '#475467',
          fontWeight: isActive('/dashboard/ai') ? 700 : 500,
          fontSize: '13.5px', textDecoration: 'none'
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', minWidth: '18px', minHeight: '18px', flexShrink: 0 }}>
            <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>AI Insights</span>
          <span className="badge-pill" style={{ marginLeft: 'auto', background: '#7C3AED', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '8px', flexShrink: 0 }}>NEW</span>
        </Link>

        <div className="nav-label" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: '#98A2B3', padding: '16px 8px 4px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          ORGANIZATION
        </div>

        {/* User Management Page (/dashboard/users) - Requires user.view */}
        {(role === 'Super Admin' || hasPermission('user.view')) && (
          <Link href="/dashboard/users" className={`nav-item ${isActive('/dashboard/users') ? 'active' : ''}`} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', width: '100%', boxSizing: 'border-box',
            background: isActive('/dashboard/users') ? '#F4F3FF' : 'transparent',
            color: isActive('/dashboard/users') ? '#7C3AED' : '#475467',
            fontWeight: isActive('/dashboard/users') ? 700 : 500,
            fontSize: '13.5px', textDecoration: 'none'
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', minWidth: '18px', minHeight: '18px', flexShrink: 0 }}>
              <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>User Management</span>
          </Link>
        )}

        <Link href="/dashboard/team" className={`nav-item ${isActive('/dashboard/team') ? 'active' : ''}`} style={{
          display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', width: '100%', boxSizing: 'border-box',
          background: isActive('/dashboard/team') ? '#F4F3FF' : 'transparent',
          color: isActive('/dashboard/team') ? '#7C3AED' : '#475467',
          fontWeight: isActive('/dashboard/team') ? 700 : 500,
          fontSize: '13.5px', textDecoration: 'none'
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', minWidth: '18px', minHeight: '18px', flexShrink: 0 }}>
            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Team Members</span>
        </Link>

        <Link href="/dashboard/subscription" className={`nav-item ${isActive('/dashboard/subscription') ? 'active' : ''}`} style={{
          display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', width: '100%', boxSizing: 'border-box',
          background: isActive('/dashboard/subscription') ? '#F4F3FF' : 'transparent',
          color: isActive('/dashboard/subscription') ? '#7C3AED' : '#475467',
          fontWeight: isActive('/dashboard/subscription') ? 700 : 500,
          fontSize: '13.5px', textDecoration: 'none'
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', minWidth: '18px', minHeight: '18px', flexShrink: 0 }}>
            <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Subscription</span>
        </Link>

        <Link href="/dashboard/invoices" className={`nav-item ${isActive('/dashboard/invoices') ? 'active' : ''}`} style={{
          display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', width: '100%', boxSizing: 'border-box',
          background: isActive('/dashboard/invoices') ? '#F4F3FF' : 'transparent',
          color: isActive('/dashboard/invoices') ? '#7C3AED' : '#475467',
          fontWeight: isActive('/dashboard/invoices') ? 700 : 500,
          fontSize: '13.5px', textDecoration: 'none'
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', minWidth: '18px', minHeight: '18px', flexShrink: 0 }}>
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Invoices</span>
        </Link>

        <Link href="/dashboard/integrations" className={`nav-item ${isActive('/dashboard/integrations') ? 'active' : ''}`} style={{
          display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', width: '100%', boxSizing: 'border-box',
          background: isActive('/dashboard/integrations') ? '#F4F3FF' : 'transparent',
          color: isActive('/dashboard/integrations') ? '#7C3AED' : '#475467',
          fontWeight: isActive('/dashboard/integrations') ? 700 : 500,
          fontSize: '13.5px', textDecoration: 'none'
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', minWidth: '18px', minHeight: '18px', flexShrink: 0 }}>
            <path d="M11 4a2 2 0 114 0v1a2 2 0 002 2h1a2 2 0 110 4h-1a2 2 0 00-2 2v1a2 2 0 11-4 0v-1a2 2 0 00-2-2H8a2 2 0 110-4h1a2 2 0 002-2V4z" />
          </svg>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Integrations</span>
        </Link>

        {/* Admin Panel Link - Filtered by admin.manage or user.view */}
        {(role === 'Super Admin' || hasPermission('admin.manage') || hasPermission('user.view')) && (
          <Link href="/dashboard/admin" className={`nav-item ${isActive('/dashboard/admin') ? 'active' : ''}`} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', width: '100%', boxSizing: 'border-box',
            background: isActive('/dashboard/admin') ? '#F4F3FF' : 'transparent',
            color: isActive('/dashboard/admin') ? '#7C3AED' : '#475467',
            fontWeight: isActive('/dashboard/admin') ? 700 : 500,
            fontSize: '13.5px', textDecoration: 'none'
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', minWidth: '18px', minHeight: '18px', flexShrink: 0 }}>
              <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Admin Panel</span>
          </Link>
        )}

        <Link href="/dashboard/settings" className={`nav-item ${isActive('/dashboard/settings') ? 'active' : ''}`} style={{
          display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', width: '100%', boxSizing: 'border-box',
          background: isActive('/dashboard/settings') ? '#F4F3FF' : 'transparent',
          color: isActive('/dashboard/settings') ? '#7C3AED' : '#475467',
          fontWeight: isActive('/dashboard/settings') ? 700 : 500,
          fontSize: '13.5px', textDecoration: 'none'
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', minWidth: '18px', minHeight: '18px', flexShrink: 0 }}>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Settings</span>
        </Link>

      </nav>

      {/* User Footer Card */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #EAECF0', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F3E8FF', color: '#7C3AED', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            JD
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#101828', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>John Doe</div>
            <div style={{ fontSize: '11px', color: '#98A2B3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>john@mailmetric.io</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePermission } from '../../hooks/usePermission';

export default function Topbar({ onMenuClick }) {
  const { user, role, switchRoleDemo } = usePermission();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getRoleBadgeStyle = (roleName) => {
    switch (roleName) {
      case 'Super Admin':
        return { bg: '#FEF2F2', color: '#EF4444', border: '#FCA5A5' };
      case 'Admin':
        return { bg: '#F5F3FF', color: '#7C3AED', border: '#DDD6FE' };
      case 'User':
        return { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' };
      default:
        return { bg: '#F1F5F9', color: '#475569', border: '#CBD5E1' };
    }
  };

  const badgeStyle = getRoleBadgeStyle(role);

  return (
    <header className="topbar" style={{
      background: '#FFFFFF',
      borderBottom: '1px solid #EAECF0',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <button className="hamburger" onClick={onMenuClick} style={{ display: 'none' }}>
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" width="20" height="20">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
      
      {/* Search Input */}
      <div className="search" style={{ position: 'relative', width: '280px' }}>
        <svg fill="none" viewBox="0 0 24 24" stroke="#98A2B3" strokeWidth="2" width="16" height="16" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input 
          type="text" 
          placeholder="Search emails, lists, or docs..." 
          style={{
            width: '100%',
            padding: '8px 12px 8px 36px',
            background: '#F8FAFC',
            border: '1px solid #E4E7EC',
            borderRadius: '8px',
            fontSize: '13px',
            outline: 'none'
          }}
        />
      </div>

      {/* Right Controls: Role Demo Switcher & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* Role Demo Switcher Pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px', background: '#F8FAFC',
          border: '1px solid #E4E7EC', padding: '3px 4px', borderRadius: '20px'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#98A2B3', padding: '0 8px' }}>Test Role:</span>
          {['Super Admin', 'Admin', 'User', 'Sub User'].map((r) => (
            <button
              key={r}
              onClick={() => switchRoleDemo(r)}
              style={{
                padding: '4px 10px', borderRadius: '14px', fontSize: '11px', fontWeight: 700,
                border: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
                background: role === r ? '#7C3AED' : 'transparent',
                color: role === r ? '#FFFFFF' : '#64748B'
              }}
            >
              {r}
            </button>
          ))}
        </div>

        {/* User Credits Badge */}
        <div className="credits-badge" style={{
          background: '#F3E8FF',
          color: '#7C3AED',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>41.2k</span>
          <span style={{ opacity: 0.7, fontWeight: 500 }}>Credits</span>
        </div>

        {/* User Profile Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px', background: '#7C3AED', color: '#fff',
            fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#101828', lineHeight: 1.2 }}>
              {user?.name || 'User'}
            </div>
            <span style={{
              background: badgeStyle.bg, color: badgeStyle.color, border: `1px solid ${badgeStyle.border}`,
              fontSize: '10.5px', fontWeight: 700, padding: '1px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '2px'
            }}>
              {role}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}

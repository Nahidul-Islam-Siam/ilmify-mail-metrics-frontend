'use client';

import { usePermission } from '../../hooks/usePermission';

export default function ProtectedRoute({ permission, permissions, children }) {
  const { hasPermission, role } = usePermission();

  if (role === 'Super Admin') {
    return <>{children}</>;
  }

  let isAllowed = false;
  if (permission) {
    isAllowed = hasPermission(permission);
  } else if (permissions && Array.isArray(permissions)) {
    isAllowed = permissions.some(p => hasPermission(p));
  } else {
    isAllowed = true;
  }

  if (!isAllowed) {
    return (
      <div style={{
        maxWidth: '800px', margin: '40px auto', background: '#FFFFFF', borderRadius: '20px',
        border: '1px solid #FEE2E2', padding: '40px', textAlign: 'center', boxShadow: '0 8px 30px rgba(239,68,68,0.08)'
      }}>
        <div style={{
          width: '54px', height: '54px', borderRadius: '16px', background: '#FEF2F2', color: '#EF4444',
          fontSize: '24px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'
        }}>
          🛡️
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#991B1B', margin: '0 0 8px 0', fontFamily: "'Sora', sans-serif" }}>
          403 Access Restricted
        </h2>
        <p style={{ fontSize: '13.5px', color: '#7F1D1D', margin: '0 0 20px 0', lineHeight: 1.5 }}>
          Your current account role (<b>{role}</b>) lacks the required permission: <code>{permission || permissions?.join(', ')}</code>.
        </p>
        <div style={{ background: '#FFF5F5', border: '1px solid #FECACA', borderRadius: '12px', padding: '12px', fontSize: '12px', color: '#B91C1C', display: 'inline-block' }}>
          💡 Tip: Use the <b>Role Switcher Demo</b> pill in the top header to test as Super Admin or Admin!
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

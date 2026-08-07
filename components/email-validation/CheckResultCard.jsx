'use client';

import StatusBadge from './StatusBadge';

export default function CheckResultCard({ title, status, description }) {
  const isOk = ['Passed', 'Clean', 'Verified', 'pass', 'valid'].includes(status);
  const isFail = ['Failed', 'Invalid', 'fail', 'invalid', 'blocked'].includes(status);

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '14px',
      border: `1px solid ${isOk ? '#E2E8F0' : isFail ? '#FCA5A5' : '#E2E8F0'}`,
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
      transition: 'transform 0.15s ease, boxShadow 0.15s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '8px',
          background: isOk ? '#ECFDF5' : isFail ? '#FEF2F2' : '#FFFBEB',
          color: isOk ? '#059669' : isFail ? '#DC2626' : '#D97706',
          fontSize: '13px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {isOk ? '✓' : isFail ? '✕' : '•'}
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#101828' }}>
            {title}
          </div>
          {description && (
            <div style={{ fontSize: '11px', color: '#667085', marginTop: '2px' }}>
              {description}
            </div>
          )}
        </div>
      </div>

      <div>
        <StatusBadge status={status} />
      </div>
    </div>
  );
}

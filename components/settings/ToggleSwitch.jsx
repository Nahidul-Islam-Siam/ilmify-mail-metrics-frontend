'use client';

export default function ToggleSwitch({ label, description, checked, onChange, disabled = false, badgeText }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 0',
      borderBottom: '1px solid #F1F5F9'
    }}>
      <div style={{ paddingRight: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{label}</span>
          {badgeText && (
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '12px',
              background: checked ? '#DCFCE7' : '#F1F5F9',
              color: checked ? '#166534' : '#64748B',
              border: checked ? '1px solid #BBF7D0' : '1px solid #E2E8F0'
            }}>
              {badgeText}
            </span>
          )}
        </div>
        {description && (
          <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#64748B', lineHeight: '1.45' }}>
            {description}
          </p>
        )}
      </div>

      <div
        onClick={() => !disabled && onChange(!checked)}
        style={{
          width: '46px',
          height: '24px',
          borderRadius: '24px',
          background: checked ? '#2563EB' : '#CBD5E1',
          position: 'relative',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s ease',
          flexShrink: 0,
          opacity: disabled ? 0.5 : 1
        }}
      >
        <span style={{
          position: 'absolute',
          top: '2px',
          left: checked ? '24px' : '2px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: '#FFFFFF',
          transition: 'left 0.2s ease',
          boxShadow: '0 1px 4px rgba(0,0,0,0.25)'
        }} />
      </div>
    </div>
  );
}

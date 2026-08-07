'use client';

export default function ErrorAlert({ message, title = 'Error', onClose }: { message?: string | null; title?: string; onClose?: () => void }) {
  if (!message) return null;

  return (
    <div style={{
      background: '#FEF2F2',
      border: '1px solid #FCA5A5',
      borderRadius: '12px',
      padding: '16px 20px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      color: '#991B1B'
    }}>
      <div style={{ display: 'flex', gap: '12px' }}>
        <span style={{ fontSize: '20px' }}>🚨</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '2px' }}>{title}</div>
          <div style={{ fontSize: '13px', color: '#B91C1C', lineHeight: '1.4' }}>{message}</div>
        </div>
      </div>
      {onClose && (
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#991B1B', fontSize: '18px', cursor: 'pointer' }}>×</button>
      )}
    </div>
  );
}

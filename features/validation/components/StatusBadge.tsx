'use client';

export default function StatusBadge({ status }: { status: string }) {
  const getStyle = (st: string) => {
    const clean = (st || '').toUpperCase();
    switch (clean) {
      case 'VALID':
      case 'PASSED':
      case 'CLEAN':
      case 'VERIFIED':
        return { bg: '#ECFDF5', color: '#059669', border: '#A7F3D0', icon: '✓' };
      case 'INVALID':
      case 'FAILED':
        return { bg: '#FEF2F2', color: '#DC2626', border: '#FCA5A5', icon: '✕' };
      case 'RISKY':
      case 'WARN':
      case 'UNKNOWN':
        return { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A', icon: '⚠️' };
      case 'BLOCKED':
      case 'DISPOSABLE':
        return { bg: '#F5F3FF', color: '#7C3AED', border: '#DDD6FE', icon: '🚫' };
      default:
        return { bg: '#F1F5F9', color: '#475569', border: '#CBD5E1', icon: '•' };
    }
  };

  const style = getStyle(status);

  return (
    <span style={{
      background: style.bg,
      color: style.color,
      border: `1px solid ${style.border}`,
      fontSize: '11px',
      fontWeight: 800,
      padding: '3px 10px',
      borderRadius: '6px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      textTransform: 'uppercase',
      letterSpacing: '0.04em'
    }}>
      <span>{style.icon}</span>
      <span>{status || 'UNKNOWN'}</span>
    </span>
  );
}

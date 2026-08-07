'use client';

export default function GoogleOAuthButton({ onClick, loading = false, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        background: '#FFFFFF',
        color: '#0F172A',
        border: '1px solid #CBD5E1',
        fontWeight: 700,
        fontSize: '14px',
        padding: '10px 20px',
        borderRadius: '10px',
        cursor: loading || disabled ? 'not-allowed' : 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.15s ease'
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
        <path fill="#FBBC05" d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/>
        <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
      </svg>
      <span>{loading ? 'Connecting Google Account...' : 'Connect Google Sheets'}</span>
    </button>
  );
}

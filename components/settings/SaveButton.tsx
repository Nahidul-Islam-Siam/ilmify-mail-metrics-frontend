'use client';

interface SaveButtonProps {
  loading?: boolean;
  disabled?: boolean;
  text?: string;
  onClick?: () => void;
  onReset?: () => void;
  showReset?: boolean;
}

export default function SaveButton({ loading = false, disabled = false, text = 'Save Changes', onClick, onReset, showReset = true }: SaveButtonProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '28px',
      paddingTop: '20px',
      borderTop: '1px solid #F1F5F9'
    }}>
      {showReset ? (
        <button
          type="button"
          onClick={onReset}
          className="btn-ghost btn-sm"
          style={{ color: '#EF4444' }}
        >
          🔄 Reset Category Defaults
        </button>
      ) : (
        <div />
      )}

      <button
        type={onClick ? 'button' : 'submit'}
        onClick={onClick}
        disabled={loading || disabled}
        style={{
          background: loading || disabled ? '#94A3B8' : '#2563EB',
          color: '#FFFFFF',
          fontWeight: 700,
          fontSize: '14px',
          padding: '10px 24px',
          borderRadius: '10px',
          border: 'none',
          cursor: loading || disabled ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.15s ease'
        }}
      >
        {loading && (
          <span style={{
            width: '14px',
            height: '14px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTopColor: '#FFFFFF',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin 0.6s linear infinite'
          }} />
        )}
        <span>{loading ? 'Saving...' : text}</span>
      </button>
    </div>
  );
}

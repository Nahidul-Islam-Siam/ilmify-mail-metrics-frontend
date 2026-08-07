'use client';

export default function ConfirmationModal({ isOpen, title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, isDanger = false }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: isDanger ? '#FEF2F2' : '#EFF6FF',
            color: isDanger ? '#EF4444' : '#2563EB',
            fontSize: '24px',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 16px'
          }}>
            {isDanger ? '⚠️' : '❓'}
          </div>

          <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
            {title}
          </h3>
          <p style={{ margin: '0 0 24px', fontSize: '13.5px', color: '#64748B', lineHeight: '1.5' }}>
            {message}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button className="btn-ghost" onClick={onCancel}>
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              style={{
                background: isDanger ? '#DC2626' : '#2563EB',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '13.5px',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

interface DisconnectModalProps {
  isOpen: boolean;
  onConfirm(): void;
  onCancel(): void;
  accountEmail?: string | null;
}

export default function DisconnectModal({ isOpen, onConfirm, onCancel, accountEmail }: DisconnectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div style={{ padding: '28px', textAlign: 'center' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: '#FEF2F2',
            color: '#EF4444',
            fontSize: '26px',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 16px'
          }}>
            ⚠️
          </div>

          <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800, color: '#0F172A', fontFamily: 'Sora, sans-serif' }}>
            Disconnect Google Sheets Integration?
          </h3>
          <p style={{ margin: '0 0 20px', fontSize: '13.5px', color: '#64748B', lineHeight: '1.5' }}>
            Are you sure you want to disconnect <b style={{ color: '#0F172A' }}>{accountEmail || 'your Google account'}</b>? Automatic sync to your live spreadsheets will be paused.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button className="btn-ghost" onClick={onCancel}>
              Cancel
            </button>
            <button
              onClick={onConfirm}
              style={{
                background: '#DC2626',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '13.5px',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Yes, Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

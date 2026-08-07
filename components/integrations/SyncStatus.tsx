'use client';

interface SyncStatusProps {
  connected?: boolean;
  accountEmail?: string;
  sheetId?: string;
  sheetName?: string;
  lastSync?: string | number | Date;
  status?: string;
  onChangeSheet?: () => void;
  onSyncNow?: () => void;
  onDisconnect?: () => void;
  syncLoading?: boolean;
}

export default function SyncStatus({
  connected = false,
  accountEmail,
  sheetId,
  sheetName,
  lastSync,
  status = 'connected',
  onChangeSheet,
  onSyncNow,
  onDisconnect,
  syncLoading = false
}: SyncStatusProps) {
  if (!connected) return null;

  return (
    <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: '#DCFCE7',
            color: '#166534',
            fontSize: '22px',
            display: 'grid',
            placeItems: 'center'
          }}>
            ✓
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0, fontFamily: 'Sora, sans-serif' }}>
                Google Sheets Integration Connected
              </h3>
              <span className="tag valid" style={{ fontSize: '11.5px' }}>Active</span>
            </div>
            <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#64748B' }}>
              Validation results automatically append to your live Google Spreadsheet.
            </p>
          </div>
        </div>

        <button
          onClick={onDisconnect}
          className="btn-ghost btn-sm"
          style={{ color: '#EF4444' }}
        >
          Disconnect Account
        </button>
      </div>

      {/* Info Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
        <div style={{ padding: '16px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
            Connected Google Account
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
            📧 {accountEmail || 'Connected Account'}
          </div>
        </div>

        <div style={{ padding: '16px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
            Active Google Sheet
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>📊 {sheetName || 'Not Selected'}</span>
            <button
              onClick={onChangeSheet}
              style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '12px', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Change
            </button>
          </div>
        </div>

        <div style={{ padding: '16px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
            Last Validation Sync
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
            🕒 {lastSync ? new Date(lastSync).toLocaleString() : 'Just now'}
          </div>
        </div>
      </div>

      {/* Control Actions */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          onClick={onChangeSheet}
          className="btn-ghost"
        >
          Change Active Sheet
        </button>
        <button
          onClick={onSyncNow}
          disabled={syncLoading}
          style={{
            background: '#2563EB',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '13.5px',
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            cursor: syncLoading ? 'wait' : 'pointer',
            boxShadow: '0 4px 14px rgba(37,99,235,0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>{syncLoading ? 'Syncing...' : '⚡ Trigger Sync Now'}</span>
        </button>
      </div>

    </div>
  );
}

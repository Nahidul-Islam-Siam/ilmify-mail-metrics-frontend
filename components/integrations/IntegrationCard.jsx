'use client';

export default function IntegrationCard({
  title,
  description,
  icon,
  category,
  connected = false,
  status = 'disconnected',
  accountEmail,
  sheetName,
  onConnect,
  onManage,
  onDisconnect,
  disabled = false
}) {
  return (
    <div className="card" style={{
      padding: '24px',
      borderRadius: '16px',
      border: connected ? '1.5px solid #3B82F6' : '1px solid #E2E8F0',
      background: '#FFFFFF',
      boxShadow: connected ? '0 8px 24px -4px rgba(59,130,246,0.12)' : '0 4px 16px -2px rgba(15,23,42,0.03)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.18s ease'
    }}>
      {/* Category Pill Tag */}
      {category && (
        <span style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          fontSize: '10.5px',
          fontWeight: 700,
          textTransform: 'uppercase',
          padding: '2px 8px',
          borderRadius: '10px',
          background: '#F1F5F9',
          color: '#64748B'
        }}>
          {category}
        </span>
      )}

      <div>
        {/* App Icon & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: connected ? '#EFF6FF' : '#F8FAFC',
            border: '1px solid #E2E8F0',
            display: 'grid',
            placeItems: 'center',
            fontSize: '22px',
            flexShrink: 0
          }}>
            {icon}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0, fontFamily: 'Sora, sans-serif' }}>
                {title}
              </h3>
              {connected && (
                <span className="tag valid" style={{ fontSize: '10.5px', padding: '2px 8px' }}>
                  ✓ Connected
                </span>
              )}
            </div>
            {connected && accountEmail && (
              <div style={{ fontSize: '12px', color: '#2563EB', fontWeight: 600, marginTop: '2px' }}>
                {accountEmail}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>
          {description}
        </p>

        {/* Connected Details snippet */}
        {connected && sheetName && (
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '8px 12px',
            fontSize: '12px',
            color: '#334155',
            marginBottom: '16px'
          }}>
            📊 Destination: <b style={{ color: '#0F172A' }}>{sheetName}</b>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
        {connected ? (
          <>
            <button
              onClick={onManage}
              style={{
                flex: 1,
                background: '#2563EB',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '13px',
                padding: '9px 14px',
                borderRadius: '9px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Manage & Sync
            </button>
            <button
              onClick={onDisconnect}
              className="btn-ghost btn-sm"
              style={{ color: '#EF4444' }}
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            onClick={onConnect}
            disabled={disabled}
            style={{
              width: '100%',
              background: disabled ? '#CBD5E1' : '#2563EB',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '13.5px',
              padding: '10px 16px',
              borderRadius: '9px',
              border: 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              boxShadow: disabled ? 'none' : '0 4px 14px rgba(37,99,235,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>Connect</span>
            <span>→</span>
          </button>
        )}
      </div>
    </div>
  );
}

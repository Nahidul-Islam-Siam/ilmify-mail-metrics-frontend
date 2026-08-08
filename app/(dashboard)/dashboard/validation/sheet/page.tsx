'use client';

export default function SheetValidationPage() {
  const steps = [
    'Connect your Google Sheet with a service account',
    'MailMetric reads the email column you map',
    'Each address runs through all validation checks',
    'Valid emails sync back with status, score & last-used date'
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#101828', margin: '0 0 6px 0', fontFamily: "'Sora', sans-serif" }}>
          Google Sheet Validation
        </h1>
        <p style={{ fontSize: '13.5px', color: '#667085', margin: 0 }}>
          Connect a sheet and auto-sync valid emails as they're verified.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Left Connected Sheet Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#101828', margin: '0 0 16px 0' }}>Connected sheet</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F8FAFC', border: '1px solid #E4E7EC', borderRadius: '14px', padding: '14px 16px', marginBottom: '20px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <path d="M8 8h8M8 12h8M8 16h5" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#101828' }}>Leads — Q3 Campaign</div>
              <div style={{ fontSize: '12px', color: '#98A2B3' }}>sheet · 8,240 rows · synced 2 min ago</div>
            </div>
            <span style={{ background: '#ECFDF5', color: '#10B981', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>• Live</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #F8FAFC' }}>
              <span style={{ color: '#667085' }}>Auto-sync valid emails</span>
              <span style={{ color: '#10B981', fontWeight: 700 }}>Enabled</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #F8FAFC' }}>
              <span style={{ color: '#667085' }}>Column mapping</span>
              <span style={{ color: '#101828', fontWeight: 700 }}>Column B — email</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#667085' }}>Sync frequency</span>
              <span style={{ color: '#101828', fontWeight: 700 }}>Real-time</span>
            </div>
          </div>

          <button style={{
            width: '100%', padding: '12px', background: '#2563EB', color: '#fff', border: 'none',
            borderRadius: '12px', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
          }}>
            ✓ Validate & sync now
          </button>
        </div>

        {/* Right How it works Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#101828', margin: '0 0 20px 0' }}>How it works</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {steps.map((text, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#F3E8FF', color: '#7C3AED', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  {idx + 1}
                </div>
                <div style={{ fontSize: '13px', color: '#475467', lineHeight: 1.4, fontWeight: 500 }}>
                  {text}
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: '12px', padding: '14px', fontSize: '12px', color: '#6D28D9', lineHeight: 1.5 }}>
            <b>Tip:</b> Valid rows are tagged with the exact date and source each email was last used, so you always know your list is fresh.
          </div>
        </div>

      </div>

    </div>
  );
}

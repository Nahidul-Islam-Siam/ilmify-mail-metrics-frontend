'use client';

export default function ApiPage() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#101828', margin: '0 0 6px 0', fontFamily: "'Sora', sans-serif" }}>
            API Management
          </h1>
          <p style={{ fontSize: '13.5px', color: '#667085', margin: 0 }}>
            Keys, usage, rate limits and integration reference.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ padding: '9px 16px', background: '#FFFFFF', border: '1px solid #E4E7EC', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#344054', cursor: 'pointer' }}>
            Documentation
          </button>
          <button style={{
            padding: '9px 18px', background: '#2563EB', color: '#fff', border: 'none',
            borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
          }}>
            ⚡ Generate new key
          </button>
        </div>
      </div>

      {/* Grid Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Live API Key Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#101828', margin: '0 0 2px 0' }}>Live API key</h3>
          <p style={{ fontSize: '12.5px', color: '#98A2B3', margin: '0 0 16px 0' }}>Use this key in the Authorization header.</p>

          <div style={{ background: '#0F172A', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <code style={{ fontFamily: 'monospace', fontSize: '13.5px', color: '#F8FAFC' }}>mk_live_••••••••••••••••••••4f9a</code>
            <div style={{ display: 'flex', gap: '10px', color: '#94A3B8' }}>
              <button style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>👁</button>
              <button style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>📋</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '12px', padding: '14px 16px' }}>
              <div style={{ fontSize: '12px', color: '#667085', marginBottom: '2px' }}>Requests used</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#101828' }}>29,100</div>
            </div>
            <div style={{ background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '12px', padding: '14px 16px' }}>
              <div style={{ fontSize: '12px', color: '#667085', marginBottom: '2px' }}>Remaining limit</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#10B981' }}>70,900</div>
            </div>
          </div>
        </div>

        {/* Rate Limit Settings Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#101828', margin: '0 0 16px 0' }}>Rate limit settings</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#667085' }}>Requests / second</span>
              <span style={{ color: '#101828', fontWeight: 800 }}>50</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#667085' }}>Burst allowance</span>
              <span style={{ color: '#101828', fontWeight: 800 }}>100</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#667085' }}>Monthly quota</span>
              <span style={{ color: '#101828', fontWeight: 800 }}>100,000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#667085' }}>Concurrency</span>
              <span style={{ color: '#101828', fontWeight: 800 }}>10</span>
            </div>
          </div>

          <button style={{
            marginTop: 'auto', width: '100%', padding: '10px', background: '#F8FAFC', border: '1px solid #E4E7EC',
            borderRadius: '10px', fontSize: '13px', fontWeight: 700, color: '#344054', cursor: 'pointer'
          }}>
            Edit limits
          </button>
        </div>

      </div>

      {/* Grid Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
        
        {/* Example Request Code Block */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#101828', margin: '0 0 2px 0' }}>Example request</h3>
          <p style={{ fontSize: '12.5px', color: '#98A2B3', margin: '0 0 16px 0' }}>Validate an email via REST</p>

          <pre style={{
            background: '#0F172A', color: '#F8FAFC', borderRadius: '14px', padding: '18px',
            fontSize: '12.5px', lineHeight: 1.6, overflowX: 'auto', margin: 0, fontFamily: 'monospace'
          }}>
            <span style={{ color: '#64748B' }}># Validate a single email</span>{'\n'}
            <span style={{ color: '#F43F5E' }}>curl</span> https://api.mailmetric.io/v1/verify \{'\n'}
            {'  '}<span style={{ color: '#38BDF8' }}>-H</span> <span style={{ color: '#A3E635' }}>"Authorization: Bearer mk_live_..."</span> \{'\n'}
            {'  '}<span style={{ color: '#38BDF8' }}>-d</span> <span style={{ color: '#A3E635' }}>"email=sarah.chen@stripe.com"</span>{'\n\n'}
            <span style={{ color: '#64748B' }}># Response</span>{'\n'}
            {'{'}{'\n'}
            {'  '}<span style={{ color: '#38BDF8' }}>"email"</span>: <span style={{ color: '#A3E635' }}>"sarah.chen@stripe.com"</span>,{'\n'}
            {'  '}<span style={{ color: '#38BDF8' }}>"status"</span>: <span style={{ color: '#A3E635' }}>"valid"</span>,{'\n'}
            {'  '}<span style={{ color: '#38BDF8' }}>"score"</span>: <span style={{ color: '#F59E0B' }}>95</span>,{'\n'}
            {'  '}<span style={{ color: '#38BDF8' }}>"disposable"</span>: <span style={{ color: '#EF4444' }}>false</span>{'\n'}
            {'}'}
          </pre>
        </div>

        {/* Integration Flow Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#101828', margin: '0 0 2px 0' }}>Integration flow</h3>
          <p style={{ fontSize: '12.5px', color: '#98A2B3', margin: '0 0 24px 0' }}>Real-time validation at signup</p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ flex: 1, background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '14px', padding: '16px 10px', textAlign: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto' }}>👤</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#101828' }}>Website Signup</div>
              <div style={{ fontSize: '10.5px', color: '#98A2B3', marginTop: '2px' }}>User enters email</div>
            </div>

            <div style={{ color: '#CBD5E1', fontSize: '16px' }}>→</div>

            <div style={{ flex: 1, background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '14px', padding: '16px 10px', textAlign: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto' }}>&lt;/&gt;</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#101828' }}>MailMetric API</div>
              <div style={{ fontSize: '10.5px', color: '#98A2B3', marginTop: '2px' }}>Runs all checks</div>
            </div>

            <div style={{ color: '#CBD5E1', fontSize: '16px' }}>→</div>

            <div style={{ flex: 1, background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '14px', padding: '16px 10px', textAlign: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto' }}>✓</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#101828' }}>Validation Result</div>
              <div style={{ fontSize: '10.5px', color: '#98A2B3', marginTop: '2px' }}>Accept or reject</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

'use client';

export default function SubscriptionPage() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#101828', margin: '0 0 6px 0', fontFamily: "'Sora', sans-serif" }}>
          Subscription & Billing
        </h1>
        <p style={{ fontSize: '13.5px', color: '#667085', margin: 0 }}>
          Manage your plan, usage limits and payment method.
        </p>
      </div>

      {/* Top Grid Row: Current Plan & Usage */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginBottom: '32px' }}>
        
        {/* Left Current Plan Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#101828', margin: '0 0 16px 0' }}>Current plan</h3>

          {/* Banner */}
          <div style={{
            background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: '14px', padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px'
          }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px', background: '#7C3AED', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#101828' }}>Business</div>
              <div style={{ fontSize: '12.5px', color: '#667085', marginTop: '2px' }}>$99 / month · billed monthly</div>
            </div>
          </div>

          {/* Data List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #F8FAFC' }}>
              <span style={{ color: '#667085' }}>Usage limit</span>
              <span style={{ color: '#101828', fontWeight: 800 }}>100,000 / mo</span>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#667085' }}>Used this cycle</span>
                <span style={{ color: '#101828', fontWeight: 800 }}>62,000 (62%)</span>
              </div>
              <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '62%', background: '#7C3AED', borderRadius: '6px' }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #F8FAFC', paddingTop: '4px' }}>
              <span style={{ color: '#667085' }}>Next billing date</span>
              <span style={{ color: '#101828', fontWeight: 700 }}>Sep 1, 2026</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#667085' }}>Payment method</span>
              <span style={{ color: '#101828', fontWeight: 700 }}>Visa •••• 4242</span>
            </div>
          </div>

          <button style={{
            width: '100%', padding: '11px', background: '#FFFFFF', border: '1px solid #E4E7EC',
            borderRadius: '12px', fontSize: '13.5px', fontWeight: 700, color: '#344054', cursor: 'pointer'
          }}>
            Update payment method
          </button>
        </div>

        {/* Right Usage Graph Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#101828', margin: '0 0 2px 0' }}>Usage this month</h3>
          <p style={{ fontSize: '12.5px', color: '#98A2B3', margin: '0 0 20px 0' }}>Validations by day</p>

          {/* Area Chart */}
          <div style={{ height: '140px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <svg viewBox="0 0 300 100" style={{ width: '100%', height: '100px', overflow: 'visible' }}>
              <defs>
                <linearGradient id="usageGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M 10,60 Q 80,30 150,20 T 225,35 T 290,25 L 290,100 L 10,100 Z" fill="url(#usageGrad)" />
              <path d="M 10,60 Q 80,30 150,20 T 225,35 T 290,25" fill="none" stroke="#2563EB" strokeWidth="2.5" />
              <circle cx="10" cy="60" r="4" fill="#2563EB" />
              <circle cx="150" cy="20" r="4" fill="#2563EB" />
              <circle cx="225" cy="35" r="4" fill="#2563EB" />
              <circle cx="290" cy="25" r="4" fill="#2563EB" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#98A2B3', fontWeight: 600, marginTop: '8px' }}>
              <span>W1</span>
              <span>W2</span>
              <span>W3</span>
              <span>W4</span>
            </div>
          </div>

          <div style={{ marginTop: 'auto', background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: '12px', padding: '14px', fontSize: '12px', color: '#6D28D9', lineHeight: 1.5 }}>
            <b>On track:</b> at the current pace you'll use ~72% of your quota — no overage expected.
          </div>
        </div>

      </div>

      {/* Choose a Plan Section */}
      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#101828', marginBottom: '20px', fontFamily: "'Sora', sans-serif" }}>
        Choose a plan
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        
        {/* Plan 1: Free */}
        <div style={{
          background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '28px',
          display: 'flex', flexDirection: 'column', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#101828', margin: '0 0 6px 0' }}>Free</h4>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#101828', marginBottom: '4px' }}>
            $0 <span style={{ fontSize: '13px', color: '#98A2B3', fontWeight: 500 }}>forever</span>
          </div>
          <p style={{ fontSize: '12.5px', color: '#667085', margin: '0 0 20px 0' }}>For trying things out</p>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#475467' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span> 100 validations / month
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span> Single email checker
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span> Basic quality score
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span> Community support
            </li>
          </ul>

          <button style={{
            marginTop: 'auto', width: '100%', padding: '11px', background: '#FFFFFF', border: '1px solid #E4E7EC',
            borderRadius: '12px', fontSize: '13px', fontWeight: 700, color: '#344054', cursor: 'pointer'
          }}>
            Downgrade
          </button>
        </div>

        {/* Plan 2: Starter */}
        <div style={{
          background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '28px',
          display: 'flex', flexDirection: 'column', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#101828', margin: '0 0 6px 0' }}>Starter</h4>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#101828', marginBottom: '4px' }}>
            $29 <span style={{ fontSize: '13px', color: '#98A2B3', fontWeight: 500 }}>/mo</span>
          </div>
          <p style={{ fontSize: '12.5px', color: '#667085', margin: '0 0 20px 0' }}>For growing teams</p>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#475467' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span> 10,000 validations / month
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span> Bulk + Google Sheet sync
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span> API access & webhooks
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span> Email support
            </li>
          </ul>

          <button style={{
            marginTop: 'auto', width: '100%', padding: '11px', background: '#FFFFFF', border: '1px solid #E4E7EC',
            borderRadius: '12px', fontSize: '13px', fontWeight: 700, color: '#344054', cursor: 'pointer'
          }}>
            Choose Starter
          </button>
        </div>

        {/* Plan 3: Business (Highlighted) */}
        <div style={{
          background: '#FFFFFF', borderRadius: '20px', border: '2px solid #7C3AED', padding: '28px',
          display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 8px 30px rgba(124,58,237,0.15)'
        }}>
          {/* Top Pill Badges */}
          <div style={{
            position: 'absolute', top: '-13px', left: '28px', background: '#7C3AED', color: '#fff',
            fontSize: '11px', fontWeight: 700, padding: '3px 12px', borderRadius: '20px'
          }}>
            Most popular
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#101828', margin: 0 }}>Business</h4>
            <span style={{ background: '#ECFDF5', color: '#10B981', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
              ✓ Current
            </span>
          </div>

          <div style={{ fontSize: '32px', fontWeight: 800, color: '#101828', marginBottom: '4px' }}>
            $99 <span style={{ fontSize: '13px', color: '#98A2B3', fontWeight: 500 }}>/mo</span>
          </div>
          <p style={{ fontSize: '12.5px', color: '#667085', margin: '0 0 20px 0' }}>For scale & compliance</p>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#475467' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span> 100,000+ validations / month
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span> Full AI insights suite
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span> Team roles & activity logs
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span> Priority support & SLA
            </li>
          </ul>

          <button style={{
            marginTop: 'auto', width: '100%', padding: '11px', background: '#7C3AED', color: '#fff', border: 'none',
            borderRadius: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)'
          }}>
            Current plan
          </button>
        </div>

      </div>

    </div>
  );
}

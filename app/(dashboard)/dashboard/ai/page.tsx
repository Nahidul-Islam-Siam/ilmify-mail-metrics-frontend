'use client';

export default function AiInsightsPage() {
  const recommendations = [
    { title: 'Remove 2,140 hard-bounce addresses', tag: 'High Priority', color: '#EF4444', desc: 'Protects sender reputation' },
    { title: 'Re-engage 5,400 risky contacts before sending', tag: 'Recommended', color: '#F59E0B', desc: 'Send a confirmation email first' },
    { title: 'Block 15,430 disposable domains', tag: 'Auto-applied', color: '#8B5CF6', desc: 'Already auto-blocked in system' },
    { title: 'Prioritize 182,000 high-score leads', tag: 'Safe Lead', color: '#10B981', desc: 'Safe for active marketing campaigns' }
  ];
  
  const scoreData = [
    { range: '0-20', val: 8, pct: 15 },
    { range: '21-40', val: 14, pct: 25 },
    { range: '41-60', val: 22, pct: 40 },
    { range: '61-80', val: 58, pct: 75 },
    { range: '81-100', val: 148, pct: 100 }
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#101828', margin: '0 0 6px 0', fontFamily: "'Sora', sans-serif" }}>
          AI Insights
        </h1>
        <p style={{ fontSize: '13.5px', color: '#667085', margin: 0 }}>
          Machine-learning signals that go beyond basic validation.
        </p>
      </div>

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', borderRadius: '20px', padding: '28px 32px',
        color: '#FFFFFF', marginBottom: '24px', boxShadow: '0 8px 24px rgba(124, 58, 237, 0.25)'
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
          marginBottom: '14px'
        }}>
          ✦ Powered by MailMetric AI
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 8px 0', fontFamily: "'Sora', sans-serif" }}>
          Your list scores 94/100 for overall health
        </h2>
        <p style={{ fontSize: '13.5px', opacity: 0.9, margin: 0, maxWidth: '720px', lineHeight: 1.5 }}>
          The model analyzed 250,000 emails across engagement, domain reputation, spam-trap likelihood and lead quality. Here's what it recommends this week.
        </p>
      </div>

      {/* 4 AI Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
        
        {/* Card 1 */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', minWidth: '18px', minHeight: '18px', flexShrink: 0 }}>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              </svg>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#101828' }}>Spam Trap Detection</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#10B981', marginBottom: '4px' }}>0.02%</div>
          <p style={{ fontSize: '12px', color: '#667085', margin: '0 0 12px 0' }}>Extremely Low Risk</p>
          <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '98%', background: '#10B981', borderRadius: '6px' }}></div>
          </div>
        </div>

        {/* Card 2 */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', minWidth: '18px', minHeight: '18px', flexShrink: 0 }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#101828' }}>Domain Health</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#2563EB', marginBottom: '4px' }}>98.4 / 100</div>
          <p style={{ fontSize: '12px', color: '#667085', margin: '0 0 12px 0' }}>Exceptional Reputation</p>
          <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '94%', background: '#2563EB', borderRadius: '6px' }}></div>
          </div>
        </div>

        {/* Card 3 */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEF3C7', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', minWidth: '18px', minHeight: '18px', flexShrink: 0 }}>
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#101828' }}>MX Server Check</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#F59E0B', marginBottom: '4px' }}>99.1%</div>
          <p style={{ fontSize: '12px', color: '#667085', margin: '0 0 12px 0' }}>Optimal Response</p>
          <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '99%', background: '#F59E0B', borderRadius: '6px' }}></div>
          </div>
        </div>

        {/* Card 4 */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F5F3FF', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', minWidth: '18px', minHeight: '18px', flexShrink: 0 }}>
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#101828' }}>Disposable Block</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#8B5CF6', marginBottom: '4px' }}>6.1%</div>
          <p style={{ fontSize: '12px', color: '#667085', margin: '0 0 12px 0' }}>15,430 Burner Emails</p>
          <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '85%', background: '#8B5CF6', borderRadius: '6px' }}></div>
          </div>
        </div>

      </div>

      {/* Bottom Grid: Recommendations + Score Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        
        {/* Left Recommendations Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: '#101828', margin: '0 0 4px 0' }}>Action Recommendations</h3>
          <p style={{ fontSize: '12.5px', color: '#98A2B3', margin: '0 0 20px 0' }}>AI suggestions to improve deliverability</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recommendations.map((rec, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: i < recommendations.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#101828' }}>{rec.title}</div>
                  <div style={{ fontSize: '12px', color: '#98A2B3', marginTop: '2px' }}>{rec.desc}</div>
                </div>
                <span style={{ background: `${rec.color}15`, color: rec.color, fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '8px', flexShrink: 0 }}>
                  {rec.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Score Distribution Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: '#101828', margin: '0 0 4px 0' }}>Score Distribution</h3>
          <p style={{ fontSize: '12.5px', color: '#98A2B3', margin: '0 0 24px 0' }}>Volume of emails by score tier</p>

          <div style={{ height: '160px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', paddingBottom: '10px' }}>
            {scoreData.map((item, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', height: `${item.pct}%`, background: 'linear-gradient(180deg, #7C3AED, #6366F1)', borderRadius: '6px' }}></div>
                <span style={{ fontSize: '11px', color: '#98A2B3', fontWeight: 600 }}>{item.range}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

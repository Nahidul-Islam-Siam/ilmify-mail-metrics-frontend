'use client';

export default function AnalyticsPage() {
  const topDomains = [
    { name: 'gmail.com', count: '31,160', pct: 85, color: '#2563EB' },
    { name: 'outlook.com', count: '20,520', pct: 60, color: '#7C3AED' },
    { name: 'company.io', count: '14,060', pct: 42, color: '#10B981' },
    { name: 'yahoo.com', count: '11,020', pct: 32, color: '#F59E0B' },
    { name: 'icloud.com', count: '6,840', pct: 20, color: '#8B5CF6' },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#101828', margin: '0 0 6px 0', fontFamily: "'Sora', sans-serif" }}>
          Analytics
        </h1>
        <p style={{ fontSize: '13.5px', color: '#667085', margin: 0 }}>
          Deep-dive into validation trends and list quality over time.
        </p>
      </div>

      {/* 5 Top Stat Cards Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
        
        {/* Card 1 */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ✉
            </div>
            <span style={{ background: '#ECFDF5', color: '#10B981', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px' }}>^ +18%</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#101828' }}>38,900</div>
          <div style={{ fontSize: '11.5px', color: '#98A2B3', marginTop: '2px' }}>Validated in August</div>
        </div>

        {/* Card 2 */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ✓
            </div>
            <span style={{ background: '#ECFDF5', color: '#10B981', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px' }}>^ +2.2%</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#101828' }}>91.4%</div>
          <div style={{ fontSize: '11.5px', color: '#98A2B3', marginTop: '2px' }}>Deliverability</div>
        </div>

        {/* Card 3 */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEF3C7', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ⚡
            </div>
            <span style={{ background: '#FEF2F2', color: '#EF4444', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px' }}>- 11ms</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#101828' }}>142 ms</div>
          <div style={{ fontSize: '11.5px', color: '#98A2B3', marginTop: '2px' }}>Avg. response</div>
        </div>

        {/* Card 4 */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              🛡
            </div>
            <span style={{ background: '#ECFDF5', color: '#10B981', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px' }}>^ +1.1%</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#101828' }}>4.6%</div>
          <div style={{ fontSize: '11.5px', color: '#98A2B3', marginTop: '2px' }}>Bounce prevented</div>
        </div>

        {/* Card 5 */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ✕
            </div>
            <span style={{ background: '#ECFDF5', color: '#10B981', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px' }}>^ +6%</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#101828' }}>2,140</div>
          <div style={{ fontSize: '11.5px', color: '#98A2B3', marginTop: '2px' }}>Hard bounces caught</div>
        </div>

      </div>

      {/* Row 2: Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Bar Chart Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#101828', margin: '0 0 2px 0' }}>Validation volume</h3>
          <p style={{ fontSize: '12.5px', color: '#98A2B3', margin: '0 0 24px 0' }}>Emails processed per month</p>

          <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px', paddingBottom: '10px' }}>
            {[
              { m: 'Jan', h: 40 }, { m: 'Feb', h: 55 }, { m: 'Mar', h: 48 }, { m: 'Apr', h: 70 },
              { m: 'May', h: 82 }, { m: 'Jun', h: 75 }, { m: 'Jul', h: 90 }, { m: 'Aug', h: 100 }
            ].map((b, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', height: `${b.h}%`, background: 'linear-gradient(180deg, #7C3AED, #2563EB)', borderRadius: '6px' }}></div>
                <span style={{ fontSize: '11px', color: '#98A2B3', fontWeight: 600 }}>{b.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Line Chart Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#101828', margin: '0 0 2px 0' }}>API requests</h3>
          <p style={{ fontSize: '12.5px', color: '#98A2B3', margin: '0 0 24px 0' }}>Monthly API call volume</p>

          <div style={{ height: '180px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <svg viewBox="0 0 400 140" style={{ width: '100%', height: '140px', overflow: 'visible' }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M 10,90 Q 60,65 110,75 T 210,40 T 310,50 T 390,10 L 390,140 L 10,140 Z" fill="url(#areaGrad)" />
              <path d="M 10,90 Q 60,65 110,75 T 210,40 T 310,50 T 390,10" fill="none" stroke="#2563EB" strokeWidth="2.5" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#98A2B3', fontWeight: 600, marginTop: '8px' }}>
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((m, i) => (
                <span key={i}>{m}</span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Row 3 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Quality Breakdown Donut Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#101828', margin: '0 0 2px 0' }}>Quality breakdown</h3>
          <p style={{ fontSize: '12.5px', color: '#98A2B3', margin: '0 0 24px 0' }}>Status distribution</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0 }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="38" stroke="#10B981" strokeWidth="12" fill="none" strokeDasharray="180 240" />
                <circle cx="50" cy="50" r="38" stroke="#EF4444" strokeWidth="12" fill="none" strokeDasharray="25 240" strokeDashoffset="-180" />
                <circle cx="50" cy="50" r="38" stroke="#F59E0B" strokeWidth="12" fill="none" strokeDasharray="18 240" strokeDashoffset="-205" />
                <circle cx="50" cy="50" r="38" stroke="#8B5CF6" strokeWidth="12" fill="none" strokeDasharray="15 240" strokeDashoffset="-223" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#101828' }}>250K</div>
                <div style={{ fontSize: '10.5px', color: '#98A2B3' }}>total</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }}></div>
                <span style={{ color: '#475467', fontWeight: 600 }}>Valid</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }}></div>
                <span style={{ color: '#475467', fontWeight: 600 }}>Invalid</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }}></div>
                <span style={{ color: '#475467', fontWeight: 600 }}>Risky</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#8B5CF6' }}></div>
                <span style={{ color: '#475467', fontWeight: 600 }}>Disposable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Domains Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#101828', margin: '0 0 2px 0' }}>Top domains</h3>
          <p style={{ fontSize: '12.5px', color: '#98A2B3', margin: '0 0 20px 0' }}>By validation volume</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {topDomains.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#344054', width: '90px' }}>{d.name}</span>
                <div style={{ flex: 1, height: '8px', background: '#F1F5F9', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${d.pct}%`, background: d.color, borderRadius: '6px' }}></div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#101828', width: '50px', textAlign: 'right' }}>{d.count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

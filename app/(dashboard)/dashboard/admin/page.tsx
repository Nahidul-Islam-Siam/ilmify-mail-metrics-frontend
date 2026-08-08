'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('Admin');

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header with 3 Segmented Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#101828', margin: '0 0 6px 0', fontFamily: "'Sora', sans-serif" }}>
            Admin Panel
          </h1>
          <p style={{ fontSize: '13.5px', color: '#667085', margin: 0 }}>
            {activeTab === 'Users' && 'Personal account overview — credits, sub-users, API keys, and activity.'}
            {activeTab === 'Admin' && 'Platform oversight — users, subscriptions, security and revenue.'}
            {activeTab === 'Super Admin' && 'Master system controls — global architecture, system overrides, root security & database health.'}
          </p>
        </div>

        {/* 3 Tab Pills */}
        <div style={{
          background: '#F1F5F9', padding: '4px', borderRadius: '14px', display: 'flex', gap: '4px', border: '1px solid #E4E7EC'
        }}>
          {['Users', 'Admin', 'Super Admin'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
                border: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
                background: activeTab === tab ? '#FFFFFF' : 'transparent',
                color: activeTab === tab ? '#7C3AED' : '#64748B',
                boxShadow: activeTab === tab ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: USERS VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'Users' && (
        <>
          {/* Top 5 Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
            
            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ✉
                </div>
                <span style={{ background: '#ECFDF5', color: '#10B981', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px' }}>↑ +12%</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#101828' }}>41,200</div>
              <div style={{ fontSize: '11.5px', color: '#98A2B3', marginTop: '2px' }}>My Validations</div>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ⚡
                </div>
                <span style={{ background: '#F3E8FF', color: '#7C3AED', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px' }}>62% Left</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#101828' }}>58,800</div>
              <div style={{ fontSize: '11.5px', color: '#98A2B3', marginTop: '2px' }}>Credit Balance</div>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  👥
                </div>
                <span style={{ background: '#ECFDF5', color: '#10B981', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px' }}>Active</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#101828' }}>4</div>
              <div style={{ fontSize: '11.5px', color: '#98A2B3', marginTop: '2px' }}>Active Sub-Users</div>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEF3C7', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  🔑
                </div>
                <span style={{ background: '#ECFDF5', color: '#10B981', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px' }}>Live</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#101828' }}>2</div>
              <div style={{ fontSize: '11.5px', color: '#98A2B3', marginTop: '2px' }}>API Keys Active</div>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F1F5F9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  🛡
                </div>
                <span style={{ background: '#ECFDF5', color: '#10B981', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px' }}>Healthy</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#101828' }}>0</div>
              <div style={{ fontSize: '11.5px', color: '#98A2B3', marginTop: '2px' }}>Open Tickets</div>
            </div>

          </div>

          {/* Row 2: User Usage & Team List */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '24px' }}>
            
            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#101828', margin: '0 0 2px 0' }}>My Monthly Usage</h3>
              <p style={{ fontSize: '12.5px', color: '#98A2B3', margin: '0 0 20px 0' }}>Validations performed by your account</p>

              <div style={{ height: '160px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', paddingBottom: '10px' }}>
                {[
                  { w: 'Week 1', v: 9200, h: 55 },
                  { w: 'Week 2', v: 12400, h: 75 },
                  { w: 'Week 3', v: 8600, h: 48 },
                  { w: 'Week 4', v: 11000, h: 68 }
                ].map((item, idx) => (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ width: '100%', height: `${item.h}%`, background: 'linear-gradient(180deg, #2563EB, #60A5FA)', borderRadius: '6px' }}></div>
                    <span style={{ fontSize: '11px', color: '#98A2B3', fontWeight: 600 }}>{item.w}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#101828', margin: '0 0 2px 0' }}>Workspace Members</h3>
              <p style={{ fontSize: '12.5px', color: '#98A2B3', margin: '0 0 16px 0' }}>Sub-users sharing credit pool</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { name: 'Sarah Chen', role: 'Admin', limit: '50,000 / mo' },
                  { name: 'Marcus Lee', role: 'User', limit: '20,000 / mo' },
                  { name: 'Priya Nair', role: 'Sub-User', limit: '5,000 / mo' },
                  { name: 'Tom Barnes', role: 'Sub-User', limit: '2,000 / mo' }
                ].map((u, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: i < 3 ? '1px solid #F8FAFC' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F3E8FF', color: '#7C3AED', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {u.name[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#101828' }}>{u.name}</div>
                        <div style={{ fontSize: '11px', color: '#98A2B3' }}>{u.limit}</div>
                      </div>
                    </div>
                    <span style={{ background: '#F1F5F9', color: '#475569', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ADMIN VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'Admin' && (
        <>
          {/* Top 5 Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
            
            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ✉
                </div>
                <span style={{ background: '#ECFDF5', color: '#10B981', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px' }}>↑ +8%</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#101828' }}>12,840</div>
              <div style={{ fontSize: '11.5px', color: '#98A2B3', marginTop: '2px' }}>Total Users</div>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ✓
                </div>
                <span style={{ background: '#ECFDF5', color: '#10B981', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px' }}>↑ +14%</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#101828' }}>$284K</div>
              <div style={{ fontSize: '11.5px', color: '#98A2B3', marginTop: '2px' }}>Monthly Revenue</div>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  🛡
                </div>
                <span style={{ background: '#FEF2F2', color: '#EF4444', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px' }}>↓ -4%</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#101828' }}>318</div>
              <div style={{ fontSize: '11.5px', color: '#98A2B3', marginTop: '2px' }}>Fraud Blocked</div>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEF3C7', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ⚡
                </div>
                <span style={{ background: '#ECFDF5', color: '#10B981', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px' }}>↑ +22%</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#101828' }}>2.1M</div>
              <div style={{ fontSize: '11.5px', color: '#98A2B3', marginTop: '2px' }}>API Calls / day</div>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ✕
                </div>
                <span style={{ background: '#ECFDF5', color: '#10B981', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px' }}>↓ -2</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#101828' }}>7</div>
              <div style={{ fontSize: '11.5px', color: '#98A2B3', marginTop: '2px' }}>Security Alerts</div>
            </div>

          </div>

          {/* Row 2: Revenue Chart & Security Logs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginBottom: '24px' }}>
            
            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#101828', margin: '0 0 2px 0' }}>Revenue overview</h3>
              <p style={{ fontSize: '12.5px', color: '#98A2B3', margin: '0 0 20px 0' }}>MRR across the platform</p>

              <div style={{ height: '160px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <svg viewBox="0 0 350 100" style={{ width: '100%', height: '110px', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d="M 10,70 Q 70,55 130,45 T 250,30 T 340,15 L 340,100 L 10,100 Z" fill="url(#adminGrad)" />
                  <path d="M 10,70 Q 70,55 130,45 T 250,30 T 340,15" fill="none" stroke="#2563EB" strokeWidth="2.5" />
                </svg>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#98A2B3', fontWeight: 600, marginTop: '8px' }}>
                  {['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((m, i) => (
                    <span key={i}>{m}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#101828', margin: '0 0 2px 0' }}>Security & fraud logs</h3>
              <p style={{ fontSize: '12.5px', color: '#98A2B3', margin: '0 0 16px 0' }}>Latest flagged events</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12.5px' }}>
                {[
                  { text: 'Blocked 42 requests from flagged IP range', meta: 'fraud · 3 min ago', color: '#EF4444' },
                  { text: 'Rate limit exceeded — account throttled', meta: 'abuse · 21 min ago', color: '#F59E0B' },
                  { text: 'Disposable domain surge auto-blocked', meta: 'system · 1 hr ago', color: '#8B5CF6' },
                  { text: 'KYC verification passed for 18 accounts', meta: 'security · 2 hr ago', color: '#10B981' }
                ].map((log, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', paddingBottom: '10px', borderBottom: idx < 3 ? '1px solid #F8FAFC' : 'none' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: log.color, marginTop: '5px', flexShrink: 0 }}></div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#101828' }}>{log.text}</div>
                      <div style={{ fontSize: '11px', color: '#98A2B3', marginTop: '2px' }}>{log.meta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Row 3: Admin Tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#101828' }}>Manage Users</div>
                  <div style={{ fontSize: '12px', color: '#98A2B3' }}>12,840 active accounts</div>
                </div>
              </div>
              <span style={{ fontSize: '16px', color: '#98A2B3' }}>›</span>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💳</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#101828' }}>Manage Subscriptions</div>
                  <div style={{ fontSize: '12px', color: '#98A2B3' }}>3,210 paid plans</div>
                </div>
              </div>
              <span style={{ fontSize: '16px', color: '#98A2B3' }}>›</span>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📄</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#101828' }}>Payment Records</div>
                  <div style={{ fontSize: '12px', color: '#98A2B3' }}>$284K this month</div>
                </div>
              </div>
              <span style={{ fontSize: '16px', color: '#98A2B3' }}>›</span>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SUPER ADMIN VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'Super Admin' && (
        <>
          {/* Top 5 Master System Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
            
            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ⚙
                </div>
                <span style={{ background: '#ECFDF5', color: '#10B981', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px' }}>12 Nodes</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#101828' }}>99.99%</div>
              <div style={{ fontSize: '11.5px', color: '#98A2B3', marginTop: '2px' }}>Cluster Uptime</div>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  🗄
                </div>
                <span style={{ background: '#ECFDF5', color: '#10B981', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px' }}>Fast</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#101828' }}>14 ms</div>
              <div style={{ fontSize: '11.5px', color: '#98A2B3', marginTop: '2px' }}>Master DB Query</div>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ⚡
                </div>
                <span style={{ background: '#F3E8FF', color: '#7C3AED', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px' }}>Enforced</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#101828' }}>10K/m</div>
              <div style={{ fontSize: '11.5px', color: '#98A2B3', marginTop: '2px' }}>Global Rate Limit</div>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEF3C7', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  🔑
                </div>
                <span style={{ background: '#FEF3C7', color: '#D97706', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px' }}>Root</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#101828' }}>3</div>
              <div style={{ fontSize: '11.5px', color: '#98A2B3', marginTop: '2px' }}>System Overrides</div>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  📜
                </div>
                <span style={{ background: '#ECFDF5', color: '#10B981', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px' }}>24h Log</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#101828' }}>1,420</div>
              <div style={{ fontSize: '11.5px', color: '#98A2B3', marginTop: '2px' }}>Master Audit Events</div>
            </div>

          </div>

          {/* Row 2: Super Admin System Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginBottom: '24px' }}>
            
            {/* System Architecture Controls */}
            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#101828', margin: '0 0 2px 0' }}>Global Infrastructure Traffic</h3>
              <p style={{ fontSize: '12.5px', color: '#98A2B3', margin: '0 0 20px 0' }}>Master API Gateway throughput & server loads</p>

              <div style={{ height: '160px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <svg viewBox="0 0 350 100" style={{ width: '100%', height: '110px', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="superGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d="M 10,40 Q 70,80 130,30 T 250,60 T 340,20 L 340,100 L 10,100 Z" fill="url(#superGrad)" />
                  <path d="M 10,40 Q 70,80 130,30 T 250,60 T 340,20" fill="none" stroke="#7C3AED" strokeWidth="2.5" />
                </svg>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#98A2B3', fontWeight: 600, marginTop: '8px' }}>
                  {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'].map((t, i) => (
                    <span key={i}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Master Security Logs */}
            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#101828', margin: '0 0 2px 0' }}>Root Security Audit</h3>
              <p style={{ fontSize: '12.5px', color: '#98A2B3', margin: '0 0 16px 0' }}>Master admin override events</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12.5px' }}>
                {[
                  { text: 'Master IP Range 192.168.1.1 whitelist added', meta: 'Root Admin · 10 min ago', color: '#10B981' },
                  { text: 'PostgreSQL Database Automated Backup verified', meta: 'System · 1 hr ago', color: '#2563EB' },
                  { text: 'Global API Throttle raised to 10,000/min', meta: 'Super Admin · 4 hr ago', color: '#7C3AED' },
                  { text: 'Emergency System Override toggled for Node #4', meta: 'Super Admin · 8 hr ago', color: '#F59E0B' }
                ].map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', paddingBottom: '10px', borderBottom: idx < 3 ? '1px solid #F8FAFC' : 'none' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, marginTop: '5px', flexShrink: 0 }}></div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#101828' }}>{s.text}</div>
                      <div style={{ fontSize: '11px', color: '#98A2B3', marginTop: '2px' }}>{s.meta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Row 3: Super Admin Action Tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚙</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#101828' }}>System Configuration</div>
                  <div style={{ fontSize: '12px', color: '#98A2B3' }}>Environment & API Secrets</div>
                </div>
              </div>
              <span style={{ fontSize: '16px', color: '#98A2B3' }}>›</span>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔒</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#101828' }}>Global Security Rules</div>
                  <div style={{ fontSize: '12px', color: '#98A2B3' }}>Firewall & IP Whitelists</div>
                </div>
              </div>
              <span style={{ fontSize: '16px', color: '#98A2B3' }}>›</span>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#FEF3C7', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚡</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#101828' }}>Database & Cache Flush</div>
                  <div style={{ fontSize: '12px', color: '#98A2B3' }}>Redis & Cluster Maintenance</div>
                </div>
              </div>
              <span style={{ fontSize: '16px', color: '#98A2B3' }}>›</span>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

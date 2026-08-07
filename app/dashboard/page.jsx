"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [hoverBar, setHoverBar] = useState('Wed');
  const [hoverCard1, setHoverCard1] = useState('Wed');
  const [hoverCard3, setHoverCard3] = useState('Wed');

  const days = [
    { day: 'Mon', valid: 280, disp: 40, risk: 20, inv: 30 },
    { day: 'Tue', valid: 340, disp: 50, risk: 25, inv: 35 },
    { day: 'Wed', valid: 421, disp: 65, risk: 35, inv: 45 },
    { day: 'Thu', valid: 310, disp: 45, risk: 22, inv: 28 },
    { day: 'Fri', valid: 290, disp: 35, risk: 18, inv: 25 },
    { day: 'Sat', valid: 380, disp: 55, risk: 30, inv: 38 },
    { day: 'Sun', valid: 260, disp: 30, risk: 15, inv: 20 },
  ];

  const card1Data = [
    { day: 'Mon', valid: 40, inv: 20 },
    { day: 'Tue', valid: 60, inv: 35 },
    { day: 'Wed', valid: 1256, inv: 680 },
    { day: 'Thu', valid: 55, inv: 30 },
    { day: 'Fri', valid: 70, inv: 45 },
    { day: 'Sat', valid: 45, inv: 25 },
    { day: 'Sun', valid: 35, inv: 15 },
  ];

  const activity = [
    { e: 'sarah.chen@stripe.com', s: 'valid', r: 96, c: '#10B981', d: '2 min ago' },
    { e: 'noreply@tempmail.io', s: 'disposable', r: 12, c: '#EF4444', d: '8 min ago' },
    { e: 'm.torres@acme.co', s: 'valid', r: 91, c: '#10B981', d: '14 min ago' },
    { e: 'info@unknown-dom.xyz', s: 'risky', r: 54, c: '#F59E0B', d: '22 min ago' },
    { e: 'j.smith@gmial.com', s: 'invalid', r: 8, c: '#EF4444', d: '31 min ago' },
    { e: 'hello@company.io', s: 'valid', r: 88, c: '#10B981', d: '40 min ago' },
  ];

  return (
    <div style={{ padding: '24px 32px', background: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Top Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#101828', margin: '0 0 4px 0', fontFamily: "'Sora', sans-serif" }}>
            Welcome back, John 👋
          </h1>
          <p style={{ fontSize: '13.5px', color: '#667085', margin: 0 }}>
            Monitor your email validation performance, API usage, and deliverability across all channels.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{
            padding: '9px 16px', background: '#FFFFFF', border: '1px solid #E4E7EC', borderRadius: '10px',
            fontSize: '13px', fontWeight: 600, color: '#344054', display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            Last 30 days ▾
          </button>
          <Link href="/dashboard/validation/single" style={{
            padding: '9px 18px', background: '#8B5CF6', color: '#fff', border: 'none', borderRadius: '10px',
            fontSize: '13.5px', fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 14px rgba(139, 92, 246, 0.35)',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            + Validate Email
          </Link>
        </div>
      </div>

      {/* Top Stat Cards Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '18px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#667085', marginBottom: '6px' }}>Total Emails Checked</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#101828' }}>250,000</div>
          <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>↑ +12.4% vs last month</span>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '18px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#667085', marginBottom: '6px' }}>Valid Emails</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#10B981' }}>92%</div>
          <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>↑ +3.1% deliverable</span>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '18px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#667085', marginBottom: '6px' }}>Invalid Emails</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#EF4444' }}>8%</div>
          <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>↓ -1.8% bounce risk</span>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '18px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#667085', marginBottom: '6px' }}>Disposable Blocked</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#8B5CF6' }}>15,430</div>
          <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>↑ +9.6% temp domains</span>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '18px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#667085', marginBottom: '6px' }}>Success Rate</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#101828' }}>96%</div>
          <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>↑ +0.7% accuracy</span>
        </div>
      </div>

      {/* Hero Card: Email Validation Overview */}
      <div style={{
        background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0',
        padding: '28px 32px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#101828', margin: 0 }}>Email Validation Overview</h2>
              <span style={{ background: '#ECFDF5', color: '#10B981', fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>+ 24% Growth</span>
            </div>
            <p style={{ fontSize: '13.5px', color: '#667085', margin: 0 }}>
              Your average email deliverability rate over the last 30 days is <b style={{ color: '#101828' }}>96%</b>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ padding: '7px 14px', background: '#FFFFFF', border: '1px solid #E4E7EC', borderRadius: '8px', fontSize: '12.5px', fontWeight: 600, color: '#344054' }}>Filter</button>
            <button style={{ padding: '7px 14px', background: '#FFFFFF', border: '1px solid #E4E7EC', borderRadius: '8px', fontSize: '12.5px', fontWeight: 600, color: '#344054' }}>Weekly ▾</button>
          </div>
        </div>

        {/* Overview Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '40px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13.5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475467', fontWeight: 500 }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#10B981' }}></span>
                Valid Emails
              </div>
              <b style={{ color: '#101828' }}>92%</b>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13.5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475467', fontWeight: 500 }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#8B5CF6' }}></span>
                Disposable Blocked
              </div>
              <b style={{ color: '#101828' }}>6.2%</b>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13.5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475467', fontWeight: 500 }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#F59E0B' }}></span>
                Risky / Catch-all
              </div>
              <b style={{ color: '#101828' }}>5%</b>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13.5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475467', fontWeight: 500 }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#EF4444' }}></span>
                Invalid / Bounced
              </div>
              <b style={{ color: '#101828' }}>8%</b>
            </div>
          </div>

          <div style={{ position: 'relative', height: '180px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: '24px' }}>
            {days.map((item, i) => (
              <div key={i} onMouseEnter={() => setHoverBar(item.day)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', position: 'relative' }}>
                
                {hoverBar === item.day && (
                  <div style={{
                    position: 'absolute', bottom: '100%', marginBottom: '12px', background: '#FFFFFF',
                    border: '1px solid #EAECF0', borderRadius: '12px', padding: '12px 14px', boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                    zIndex: 20, width: '170px'
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#98A2B3', marginBottom: '8px' }}>Jan 5, 2024</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}><span style={{ color: '#475467' }}>Valid</span><b>{item.valid * 100}</b></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}><span style={{ color: '#475467' }}>Disposable</span><b>{item.disp * 10}</b></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}><span style={{ color: '#475467' }}>Risky</span><b>{item.risk * 10}</b></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}><span style={{ color: '#475467' }}>Invalid</span><b>{item.inv * 10}</b></div>
                  </div>
                )}

                <div style={{ width: '48px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                  <div style={{ width: '100%', height: '55px', background: item.day === hoverBar ? '#10B981' : '#F2F4F7', borderRadius: '6px', transition: '0.2s' }}></div>
                  <div style={{ width: '100%', height: '25px', background: item.day === hoverBar ? '#8B5CF6' : '#F2F4F7', borderRadius: '6px', transition: '0.2s' }}></div>
                  <div style={{ width: '100%', height: '15px', background: item.day === hoverBar ? '#F59E0B' : '#F2F4F7', borderRadius: '4px', transition: '0.2s' }}></div>
                  <div style={{ width: '100%', height: '10px', background: item.day === hoverBar ? '#EF4444' : '#F2F4F7', borderRadius: '3px', transition: '0.2s' }}></div>
                </div>

                <span style={{ fontSize: '12px', color: '#98A2B3', marginTop: '12px', fontWeight: 600 }}>{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
        
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 500, color: '#667085' }}>Validations Stream</span>
            <span style={{ fontSize: '12px', color: '#667085', cursor: 'pointer' }}>Weekly ▾</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#101828', margin: 0 }}>234,567</h3>
            <span style={{ background: '#ECFDF5', color: '#10B981', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>+ 3%</span>
          </div>

          <div style={{ height: '140px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', position: 'relative' }}>
            {card1Data.map((d, i) => (
              <div key={i} onMouseEnter={() => setHoverCard1(d.day)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', position: 'relative' }}>
                {hoverCard1 === d.day && (
                  <div style={{
                    position: 'absolute', bottom: '100%', marginBottom: '8px', background: '#FFFFFF',
                    border: '1px solid #EAECF0', borderRadius: '10px', padding: '8px 10px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    zIndex: 10, width: '130px', fontSize: '10.5px'
                  }}>
                    <div style={{ color: '#98A2B3', marginBottom: '4px' }}>Jan 5, 2024</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Valid</span><b>{d.valid}</b></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Invalid</span><b>{d.inv}</b></div>
                  </div>
                )}
                <div style={{
                  width: '24px', height: d.day === hoverCard1 ? '90px' : '40px',
                  background: d.day === hoverCard1 ? 'linear-gradient(180deg, #10B981, #34D399)' : '#F2F4F7',
                  borderRadius: '6px', transition: '0.2s'
                }}></div>
                <span style={{ fontSize: '11px', color: '#98A2B3', marginTop: '8px' }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 500, color: '#667085' }}>API Traffic</span>
            <span style={{ fontSize: '12px', color: '#667085', cursor: 'pointer' }}>Daily ▾</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#101828', margin: 0 }}>125,460</h3>
            <span style={{ background: '#ECFDF5', color: '#10B981', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>+ 14%</span>
          </div>

          <div style={{ height: '100px', width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 300 100" style={{ width: '100%', height: '100%' }}>
              <path d="M0,60 Q50,30 100,50 T200,40 T300,30" fill="none" stroke="#8B5CF6" strokeWidth="2.5" />
              <path d="M0,75 Q50,55 100,65 T200,50 T300,45" fill="none" stroke="#10B981" strokeWidth="2" />
              <path d="M0,85 Q50,75 100,80 T200,70 T300,65" fill="none" stroke="#F59E0B" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 500, color: '#667085' }}>Disposable Protection</span>
            <span style={{ fontSize: '12px', color: '#667085', cursor: 'pointer' }}>Weekly ▾</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#101828', margin: 0 }}>15,430</h3>
            <span style={{ background: '#ECFDF5', color: '#10B981', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>+ 9.6%</span>
          </div>

          <div style={{ height: '120px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', position: 'relative' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={i} onMouseEnter={() => setHoverCard3(day)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                <div style={{
                  width: '12px', height: i === 2 ? '80px' : '40px',
                  background: i === 2 ? '#8B5CF6' : '#F2F4F7', borderRadius: '4px'
                }}></div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#101828', margin: 0 }}>Recent Validation Activity</h3>
          <Link href="/dashboard/analytics" style={{ fontSize: '12.5px', color: '#7C3AED', fontWeight: 600, textDecoration: 'none' }}>View full logs →</Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #EAECF0', textAlign: 'left', fontSize: '11px', color: '#98A2B3', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px' }}>Email Address</th>
                <th style={{ padding: '10px 12px' }}>Status</th>
                <th style={{ padding: '10px 12px' }}>Quality Score</th>
                <th style={{ padding: '10px 12px' }}>Checked</th>
              </tr>
            </thead>
            <tbody>
              {activity.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #F2F4F7', fontSize: '13px', color: '#344054' }}>
                  <td style={{ padding: '12px' }}><b>{item.e}</b></td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                      background: item.s === 'valid' ? '#ECFDF5' : item.s === 'disposable' ? '#F5F3FF' : item.s === 'risky' ? '#FFFBEB' : '#FEF2F2',
                      color: item.s === 'valid' ? '#10B981' : item.s === 'disposable' ? '#8B5CF6' : item.s === 'risky' ? '#F59E0B' : '#EF4444'
                    }}>
                      {item.s.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontWeight: 700, color: item.c }}>{item.r} / 100</td>
                  <td style={{ padding: '12px', color: '#98A2B3', fontSize: '12px' }}>{item.d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

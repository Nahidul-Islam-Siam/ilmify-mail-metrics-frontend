'use client';

import { useState } from 'react';

export default function TeamPage() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Sub-User');
  const [creditLimit, setCreditLimit] = useState('5000');

  const [members, setMembers] = useState([
    { name: 'Alex Rivera', email: 'alex@mailmetric.io', role: 'Super Admin', status: 'Active', active: 'Now', limit: 'Unlimited' },
    { name: 'Sarah Chen', email: 'sarah@acme.com', role: 'Admin', status: 'Active', active: '2 min ago', limit: '50,000 / mo' },
    { name: 'Marcus Lee', email: 'marcus@acme.com', role: 'User', status: 'Active', active: '1 hr ago', limit: '20,000 / mo' },
    { name: 'Priya Nair', email: 'priya@acme.com', role: 'Sub-User', status: 'Active', active: '3 hr ago', limit: '5,000 / mo' },
    { name: 'Tom Barnes', email: 'tom@acme.com', role: 'Sub-User', status: 'Active', active: 'Yesterday', limit: '2,000 / mo' },
  ]);

  const handleInvite = (e) => {
    e.preventDefault();
    if (!newEmail) return;
    setMembers([
      ...members,
      {
        name: newEmail.split('@')[0],
        email: newEmail,
        role: newRole,
        status: 'Pending',
        active: 'Just now',
        limit: `${parseInt(creditLimit).toLocaleString()} / mo`
      }
    ]);
    setNewEmail('');
    setShowInviteModal(false);
  };

  const logs = [
    { name: 'Sarah Chen', text: 'allocated 5,000 validation credits to Sub-User (Priya Nair)', time: '10 min ago' },
    { name: 'Marcus Lee', text: 'ran a bulk validation of 48,210 emails', time: '1 hr ago' },
    { name: 'Super Admin', text: 'updated workspace security policy and API limits', time: '3 hr ago' },
    { name: 'System', text: 'auto-blocked 150 disposable domains across sub-users', time: 'Yesterday' }
  ];

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Super Admin':
        return { bg: '#FEF2F2', color: '#EF4444' };
      case 'Admin':
        return { bg: '#F5F3FF', color: '#7C3AED' };
      case 'User':
        return { bg: '#EFF6FF', color: '#2563EB' };
      default:
        return { bg: '#F1F5F9', color: '#475569' };
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#101828', margin: '0 0 6px 0', fontFamily: "'Sora', sans-serif" }}>
            Team & Sub-Users Management
          </h1>
          <p style={{ fontSize: '13.5px', color: '#667085', margin: 0 }}>
            Create sub-users, assign roles (Super Admin, Admin, User, Sub-User), and share validation credit limits.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          style={{
            padding: '10px 20px', background: '#2563EB', color: '#fff', border: 'none',
            borderRadius: '12px', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
          }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Add Sub-User / Member
        </button>
      </div>

      {/* Grid Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        
        {/* Left Members Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#101828', margin: '0 0 4px 0' }}>Members & Sub-User Accounts</h3>
            <p style={{ fontSize: '12.5px', color: '#98A2B3', margin: 0 }}>{members.length} active users · shared workspace credit pool</p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #EAECF0', textAlign: 'left', fontSize: '11.5px', color: '#98A2B3', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 12px 10px 0' }}>Member</th>
                  <th style={{ padding: '10px 12px' }}>Role</th>
                  <th style={{ padding: '10px 12px' }}>Credit Limit</th>
                  <th style={{ padding: '10px 12px' }}>Status</th>
                  <th style={{ padding: '10px 0 10px 12px', textAlign: 'right' }}>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m, i) => {
                  const roleStyle = getRoleBadge(m.role);
                  return (
                    <tr key={i} style={{ borderBottom: i < members.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
                      
                      {/* Member cell */}
                      <td style={{ padding: '14px 12px 14px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '10px', background: '#F3E8FF', color: '#7C3AED',
                            fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                          }}>
                            {m.name[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#101828' }}>{m.name}</div>
                            <div style={{ fontSize: '11.5px', color: '#98A2B3' }}>{m.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td style={{ padding: '14px 12px' }}>
                        <span style={{
                          background: roleStyle.bg, color: roleStyle.color, fontSize: '11px', fontWeight: 700,
                          padding: '3px 8px', borderRadius: '6px', whiteSpace: 'nowrap'
                        }}>
                          {m.role}
                        </span>
                      </td>

                      {/* Credit Limit */}
                      <td style={{ padding: '14px 12px', fontSize: '12.5px', fontWeight: 600, color: '#344054' }}>
                        {m.limit}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 12px' }}>
                        <span style={{
                          color: m.status === 'Active' ? '#10B981' : '#F59E0B',
                          fontSize: '12px', fontWeight: 700
                        }}>
                          {m.status === 'Active' ? '● Active' : '○ Pending'}
                        </span>
                      </td>

                      {/* Last Active */}
                      <td style={{ padding: '14px 0 14px 12px', textAlign: 'right', fontSize: '12px', color: '#98A2B3' }}>
                        {m.active}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Audit Log Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#101828', margin: '0 0 4px 0' }}>Audit & Access Log</h3>
            <p style={{ fontSize: '12.5px', color: '#98A2B3', margin: 0 }}>Sub-user credit & security events</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {logs.map((l, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', paddingBottom: '12px', borderBottom: i < logs.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #EAECF0',
                  color: '#7C3AED', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px'
                }}>
                  {l.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: '12.5px', color: '#344054', lineHeight: 1.45 }}>
                    <b style={{ color: '#101828' }}>{l.name}</b> {l.text}
                  </div>
                  <div style={{ fontSize: '11px', color: '#98A2B3', marginTop: '2px' }}>{l.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Invite Sub-User Modal */}
      {showInviteModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{
            background: '#FFFFFF', borderRadius: '20px', width: '420px', padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid #EAECF0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#101828', margin: 0 }}>Add Sub-User / Member</h3>
              <button onClick={() => setShowInviteModal(false)} style={{ background: 'none', border: 'none', fontSize: '18px', color: '#98A2B3', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#344054', display: 'block', marginBottom: '6px' }}>Email address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="member@company.com"
                  required
                  style={{
                    width: '100%', padding: '10px 14px', background: '#F8FAFC', border: '1px solid #E4E7EC',
                    borderRadius: '10px', fontSize: '13.5px', color: '#101828', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#344054', display: 'block', marginBottom: '6px' }}>Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', background: '#F8FAFC', border: '1px solid #E4E7EC',
                    borderRadius: '10px', fontSize: '13.5px', color: '#101828', outline: 'none', boxSizing: 'border-box'
                  }}
                >
                  <option value="Sub-User">Sub-User (Restricted credits)</option>
                  <option value="User">User (Standard access)</option>
                  <option value="Admin">Admin (Full management)</option>
                  <option value="Super Admin">Super Admin (Owner)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#344054', display: 'block', marginBottom: '6px' }}>Monthly Credit Limit</label>
                <input
                  type="number"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                  placeholder="5000"
                  style={{
                    width: '100%', padding: '10px 14px', background: '#F8FAFC', border: '1px solid #E4E7EC',
                    borderRadius: '10px', fontSize: '13.5px', color: '#101828', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  style={{
                    flex: 1, padding: '10px', background: '#F8FAFC', border: '1px solid #E4E7EC',
                    borderRadius: '10px', fontSize: '13px', fontWeight: 700, color: '#344054', cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1, padding: '10px', background: '#2563EB', color: '#fff', border: 'none',
                    borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

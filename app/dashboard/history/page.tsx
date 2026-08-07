'use client';

import { useState } from 'react';
import ProtectedRoute from '../../../components/rbac/ProtectedRoute';
import StatusBadge from '../../../components/email-validation/StatusBadge';

interface HistoryRecord {
  id: number;
  email: string;
  status: string;
  score: number;
  disposable: string;
  mx: string;
  date: string;
}

export default function ValidationHistoryPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([
    { id: 1, email: 'alex.rivera@acme.io', status: 'VALID', score: 98, disposable: 'Clean', mx: 'Passed', date: '2026-08-06 09:20' },
    { id: 2, email: 'john.doe@temp-mail.org', status: 'BLOCKED', score: 0, disposable: 'Blocked', mx: 'Passed', date: '2026-08-06 09:14' },
    { id: 3, email: 'sarah.smith@10minutemail.com', status: 'BLOCKED', score: 0, disposable: 'Blocked', mx: 'Passed', date: '2026-08-06 08:50' },
    { id: 4, email: 'marcus.lee@gmail.com', status: 'VALID', score: 95, disposable: 'Clean', mx: 'Passed', date: '2026-08-06 08:30' },
    { id: 5, email: 'marketing@fakeinbox.com', status: 'BLOCKED', score: 0, disposable: 'Blocked', mx: 'Passed', date: '2026-08-05 18:40' },
    { id: 6, email: 'unknown.user@invalid-domain-xyz.com', status: 'INVALID', score: 15, disposable: 'Clean', mx: 'Failed', date: '2026-08-05 16:10' },
  ]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);

  const filtered = history.filter(item => {
    const matchesSearch = item.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <ProtectedRoute permission="user.view">
      <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>

        {/* Page Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#101828', margin: '0 0 6px 0', fontFamily: "'Sora', sans-serif" }}>
            Validation History Logs
          </h1>
          <p style={{ fontSize: '13.5px', color: '#667085', margin: 0 }}>
            Audit log of all previous email validations, quality scores, and disposable block checks.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div style={{
          background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '16px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'
        }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <svg fill="none" viewBox="0 0 24 24" stroke="#98A2B3" strokeWidth="2" width="16" height="16" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history by email..."
              style={{
                width: '100%', padding: '8px 12px 8px 36px', background: '#F8FAFC', border: '1px solid #E4E7EC',
                borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#667085', fontWeight: 600 }}>Filter Status:</span>
            {['All', 'VALID', 'INVALID', 'BLOCKED'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                  border: statusFilter === st ? 'none' : '1px solid #E4E7EC',
                  background: statusFilter === st ? '#7C3AED' : '#FFFFFF',
                  color: statusFilter === st ? '#FFFFFF' : '#475467',
                  cursor: 'pointer'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* History Table */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #EAECF0', textAlign: 'left', fontSize: '11.5px', color: '#98A2B3', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px' }}>Target Email</th>
                  <th style={{ padding: '12px 14px' }}>Validation Status</th>
                  <th style={{ padding: '12px 14px' }}>Risk Score</th>
                  <th style={{ padding: '12px 14px' }}>Disposable Check</th>
                  <th style={{ padding: '12px 14px' }}>MX Check</th>
                  <th style={{ padding: '12px 14px' }}>Timestamp</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(row => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                    
                    <td style={{ padding: '14px', fontSize: '13.5px', fontWeight: 700, color: '#101828' }}>
                      {row.email}
                    </td>

                    <td style={{ padding: '14px' }}>
                      <StatusBadge status={row.status} />
                    </td>

                    <td style={{ padding: '14px', fontSize: '14px', fontWeight: 800, color: row.score >= 80 ? '#10B981' : '#EF4444' }}>
                      {row.score}/100
                    </td>

                    <td style={{ padding: '14px' }}>
                      <span style={{
                        background: row.disposable === 'Blocked' ? '#FEF2F2' : '#ECFDF5',
                        color: row.disposable === 'Blocked' ? '#DC2626' : '#059669',
                        fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px'
                      }}>
                        {row.disposable}
                      </span>
                    </td>

                    <td style={{ padding: '14px', fontSize: '12.5px', color: '#344054', fontWeight: 600 }}>
                      {row.mx}
                    </td>

                    <td style={{ padding: '14px', fontSize: '12px', color: '#98A2B3' }}>
                      {row.date}
                    </td>

                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedRecord(row)}
                        style={{ padding: '6px 12px', background: '#F8FAFC', border: '1px solid #E4E7EC', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#344054', cursor: 'pointer' }}
                      >
                        View Details
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Record Detail Modal */}
        {selectedRecord && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150
          }}>
            <div style={{ background: '#FFFFFF', borderRadius: '20px', width: '460px', padding: '28px', border: '1px solid #EAECF0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#101828', margin: 0 }}>Validation Record Details</h3>
                <button onClick={() => setSelectedRecord(null)} style={{ background: 'none', border: 'none', fontSize: '18px', color: '#98A2B3', cursor: 'pointer' }}>✕</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                <div><b>Email:</b> {selectedRecord.email}</div>
                <div><b>Status:</b> <StatusBadge status={selectedRecord.status} /></div>
                <div><b>Quality Score:</b> {selectedRecord.score}/100</div>
                <div><b>Disposable Check:</b> {selectedRecord.disposable}</div>
                <div><b>MX DNS Record Check:</b> {selectedRecord.mx}</div>
                <div><b>Checked Date:</b> {selectedRecord.date}</div>
              </div>

              <button
                onClick={() => setSelectedRecord(null)}
                style={{ width: '100%', padding: '10px', background: '#7C3AED', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', marginTop: '20px' }}
              >
                Close Record
              </button>
            </div>
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}

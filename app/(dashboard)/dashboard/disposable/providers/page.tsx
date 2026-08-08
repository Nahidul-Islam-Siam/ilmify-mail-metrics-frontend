'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/rbac/ProtectedRoute';

interface DisposableProvider { name: string; category?: string; domainCount: number }

export default function DisposableProviderManagementPage() {
  const [providers, setProviders] = useState<DisposableProvider[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/disposable-domains/providers');
      if (res.ok) {
        const data = await res.json();
        setProviders(data.providers || []);
      }
    } catch (err) {
      console.warn('API error, using local fallback state');
    }
  };

  const filtered = providers.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <ProtectedRoute permission="user.view">
      <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>

        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#101828', margin: '0 0 6px 0', fontFamily: "'Sora', sans-serif" }}>
              Disposable Provider Management
            </h1>
            <p style={{ fontSize: '13.5px', color: '#667085', margin: 0 }}>
              Overview of all 30 tracked temporary email providers and their blocked domain portfolios.
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '16px 20px', marginBottom: '20px' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <svg fill="none" viewBox="0 0 24 24" stroke="#98A2B3" strokeWidth="2" width="16" height="16" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search provider name..."
              style={{
                width: '100%', padding: '8px 12px 8px 36px', background: '#F8FAFC', border: '1px solid #E4E7EC',
                borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Provider Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
          {filtered.map((prov, i) => (
            <div key={i} style={{
              background: '#FFFFFF', borderRadius: '18px', border: '1px solid #EAECF0', padding: '22px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '12px', background: '#F3E8FF', color: '#7C3AED',
                    fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    🏛️
                  </div>
                  <span style={{ background: '#ECFDF5', color: '#059669', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                    Active
                  </span>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#101828', margin: '0 0 4px 0', fontFamily: "'Sora', sans-serif" }}>
                  {prov.name}
                </h3>
                <span style={{ fontSize: '11.5px', color: '#7C3AED', fontWeight: 700, background: '#F5F3FF', padding: '2px 6px', borderRadius: '4px' }}>
                  {prov.category || 'Temporary Email'}
                </span>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #F2F4F7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12.5px', color: '#667085', fontWeight: 600 }}>Total Blocked Domains:</span>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#101828', fontFamily: "'Sora', sans-serif" }}>
                  {prov.domainCount} {prov.domainCount === 1 ? 'domain' : 'domains'}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </ProtectedRoute>
  );
}

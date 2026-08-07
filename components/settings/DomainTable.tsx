'use client';

import { useState, type FormEvent } from 'react';

type DomainList = 'whitelist' | 'blacklist';
interface DomainTableProps {
  whitelist?: string[];
  blacklist?: string[];
  onUpdateWhitelist(domains: string[]): void;
  onUpdateBlacklist(domains: string[]): void;
}

export default function DomainTable({ whitelist = [], blacklist = [], onUpdateWhitelist, onUpdateBlacklist }: DomainTableProps) {
  const [newDomain, setNewDomain] = useState('');
  const [targetList, setTargetList] = useState<DomainList>('blacklist');

  const handleAddDomain = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    const domainClean = newDomain.trim().toLowerCase().replace(/^https?:\/\//, '');

    if (targetList === 'whitelist') {
      if (!whitelist.includes(domainClean)) {
        onUpdateWhitelist([...whitelist, domainClean]);
      }
    } else {
      if (!blacklist.includes(domainClean)) {
        onUpdateBlacklist([...blacklist, domainClean]);
      }
    }
    setNewDomain('');
  };

  const handleRemoveDomain = (domain: string, listType: DomainList) => {
    if (listType === 'whitelist') {
      onUpdateWhitelist(whitelist.filter(d => d !== domain));
    } else {
      onUpdateBlacklist(blacklist.filter(d => d !== domain));
    }
  };

  return (
    <div style={{ marginTop: '24px' }}>
      
      {/* Domain Addition Form */}
      <form onSubmit={handleAddDomain} style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter domain name (e.g. tempmail.com)"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          style={{
            flex: 1,
            padding: '10px 14px',
            border: '1px solid #CBD5E1',
            borderRadius: '10px',
            fontSize: '13.5px',
            outline: 'none'
          }}
        />
        <select
          value={targetList}
          onChange={(e) => setTargetList(e.target.value as DomainList)}
          style={{
            padding: '10px 14px',
            border: '1px solid #CBD5E1',
            borderRadius: '10px',
            fontSize: '13.5px',
            outline: 'none',
            background: '#FFFFFF'
          }}
        >
          <option value="blacklist">Add to Blacklist</option>
          <option value="whitelist">Add to Whitelist</option>
        </select>
        <button
          type="submit"
          style={{
            background: '#2563EB',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '13.5px',
            padding: '10px 18px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          + Add Domain
        </button>
      </form>

      {/* Blacklisted Domains Table */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🛑 Blacklisted Disposable Domains ({blacklist.length})
        </div>
        <div style={{ overflowX: 'auto', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '10px 14px', fontSize: '12px', fontWeight: 700, color: '#64748B' }}>Domain</th>
                <th style={{ padding: '10px 14px', fontSize: '12px', fontWeight: 700, color: '#64748B' }}>Provider Type</th>
                <th style={{ padding: '10px 14px', fontSize: '12px', fontWeight: 700, color: '#64748B' }}>Status</th>
                <th style={{ padding: '10px 14px', fontSize: '12px', fontWeight: 700, color: '#64748B', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {blacklist.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '16px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                    No blacklisted domains added yet.
                  </td>
                </tr>
              ) : (
                blacklist.map((domain) => (
                  <tr key={domain} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 14px', fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
                      {domain}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '12.5px', color: '#64748B' }}>
                      Disposable / Burner
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="tag bad" style={{ fontSize: '11px' }}>Blocked</span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleRemoveDomain(domain, 'blacklist')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#EF4444',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Whitelisted Domains Table */}
      <div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ✅ Whitelisted Domains ({whitelist.length})
        </div>
        <div style={{ overflowX: 'auto', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '10px 14px', fontSize: '12px', fontWeight: 700, color: '#64748B' }}>Domain</th>
                <th style={{ padding: '10px 14px', fontSize: '12px', fontWeight: 700, color: '#64748B' }}>Status</th>
                <th style={{ padding: '10px 14px', fontSize: '12px', fontWeight: 700, color: '#64748B', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {whitelist.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: '16px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                    No whitelisted domains added yet.
                  </td>
                </tr>
              ) : (
                whitelist.map((domain) => (
                  <tr key={domain} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 14px', fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
                      {domain}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="tag valid" style={{ fontSize: '11px' }}>Always Allowed</span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleRemoveDomain(domain, 'whitelist')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#EF4444',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

'use client';

import { useState } from 'react';

export const SETTINGS_SECTIONS = [
  { id: 'general', label: '1. General', icon: '⚙️', category: 'general', permission: 'settings.manage' },
  { id: 'validation', label: '2. Validation Rules', icon: '✅', category: 'validation', permission: 'settings.manage' },
  { id: 'disposable', label: '3. Disposable Email', icon: '🚫', category: 'disposable', permission: 'settings.manage' },
  { id: 'risk', label: '4. Risk Score Rules', icon: '⚡', category: 'risk', permission: 'settings.manage' },
  { id: 'smtp', label: '5. SMTP Settings', icon: '📧', category: 'smtp', permission: 'settings.manage' },
  { id: 'dns', label: '6. DNS / MX Engine', icon: '🌐', category: 'dns', permission: 'settings.manage' },
  { id: 'api', label: '7. API Configuration', icon: '🔑', category: 'api', permission: 'settings.manage' },
  { id: 'security', label: '8. Security & Auth', icon: '🛡️', category: 'security', permission: 'settings.manage', superAdminOnly: true },
  { id: 'rbac', label: '9. Users & Permissions', icon: '👥', category: 'user_permission', permission: 'settings.manage', superAdminOnly: true },
  { id: 'bulk', label: '10. Bulk Validation', icon: '📦', category: 'bulk', permission: 'settings.manage' },
  { id: 'notifications', label: '11. Notifications', icon: '🔔', category: 'notifications', permission: 'settings.manage' },
  { id: 'billing', label: '12. Billing & Plans', icon: '💳', category: 'billing', permission: 'settings.manage', superAdminOnly: true },
  { id: 'integrations', label: '13. Webhooks & Apps', icon: '🔌', category: 'api', permission: 'settings.manage' }
];

export default function SettingsLayout({ activeSection, onSelectSection, role, children }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSections = SETTINGS_SECTIONS.filter(s =>
    s.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '28px', minHeight: '680px' }}>
      
      {/* Sidebar Sub-Menu Navigation */}
      <div>
        <div className="card" style={{ padding: '16px', position: 'sticky', top: '80px' }}>
          
          {/* Section Search Box */}
          <div style={{ marginBottom: '14px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search settings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 32px',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '12.5px',
                outline: 'none',
                background: '#F8FAFC'
              }}
            />
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: '#94A3B8' }}>
              🔍
            </span>
          </div>

          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94A3B8', padding: '0 8px 8px' }}>
            System Settings ({filteredSections.length})
          </div>

          {/* Section Menu Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {filteredSections.map((sec) => {
              const isActive = activeSection === sec.id;
              const isLocked = sec.superAdminOnly && role !== 'Super Admin';

              return (
                <button
                  key={sec.id}
                  onClick={() => !isLocked && onSelectSection(sec.id)}
                  disabled={isLocked}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '9px',
                    border: 'none',
                    textAlign: 'left',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    background: isActive ? '#EFF6FF' : 'transparent',
                    color: isActive ? '#2563EB' : isLocked ? '#94A3B8' : '#334155',
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '13px',
                    transition: 'all 0.15s ease',
                    opacity: isLocked ? 0.6 : 1
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>{sec.icon}</span>
                    <span>{sec.label}</span>
                  </div>
                  {isLocked && (
                    <span style={{ fontSize: '11px' }}>🔒</span>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Main Settings Content Column */}
      <div style={{ minWidth: 0 }}>
        {children}
      </div>

    </div>
  );
}

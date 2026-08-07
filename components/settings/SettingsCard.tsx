'use client';

import type { ReactNode } from 'react';

interface SettingsCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  badge?: string;
  children: ReactNode;
  headerAction?: ReactNode;
}

export default function SettingsCard({ title, subtitle, icon, badge, children, headerAction }: SettingsCardProps) {
  return (
    <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {icon && (
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: '#EFF6FF',
              color: '#2563EB',
              fontSize: '20px',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0
            }}>
              {icon}
            </div>
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                {title}
              </h3>
              {badge && <span className="tag valid" style={{ fontSize: '11px' }}>{badge}</span>}
            </div>
            {subtitle && (
              <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#64748B', lineHeight: '1.45' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {headerAction}
      </div>
      <div>{children}</div>
    </div>
  );
}

'use client';

import type { PermissionDefinition, PermissionName } from '@/features/auth/types';

interface PermissionSelectorProps {
  availablePermissions?: Array<PermissionDefinition | PermissionName>;
  selectedPermissions?: PermissionName[];
  onChange(permissions: PermissionName[]): void;
}

export default function PermissionSelector({ availablePermissions = [], selectedPermissions = [], onChange }: PermissionSelectorProps) {
  const handleTogglePermission = (permName: PermissionName) => {
    if (selectedPermissions.includes(permName)) {
      onChange(selectedPermissions.filter(p => p !== permName));
    } else {
      onChange([...selectedPermissions, permName]);
    }
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '10px' }}>
        Default Account Permissions List
      </label>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '12px',
        padding: '16px',
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '12px'
      }}>
        {availablePermissions.map((perm) => {
          const permName = typeof perm === 'string' ? perm : perm.name;
          const label = typeof perm === 'object' && perm.label ? perm.label : permName;
          const isChecked = selectedPermissions.includes(permName);

          return (
            <label
              key={permName}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: isChecked ? '#EFF6FF' : '#FFFFFF',
                border: isChecked ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                color: isChecked ? '#1D4ED8' : '#475569',
                transition: 'all 0.15s ease'
              }}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleTogglePermission(permName)}
                style={{ width: '16px', height: '16px', accentColor: '#2563EB', cursor: 'pointer' }}
              />
              <span>{label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

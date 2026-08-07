'use client';

import type { SelectOption } from '../../types/ui';

interface SelectInputProps {
  label?: string;
  value: string;
  onChange(value: string): void;
  options?: SelectOption[];
  hint?: string;
  disabled?: boolean;
}

export default function SelectInput({
  label,
  value,
  onChange,
  options = [],
  hint,
  disabled = false
}: SelectInputProps) {
  return (
    <div style={{ marginBottom: '18px' }}>
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '10px 14px',
          border: '1px solid #CBD5E1',
          borderRadius: '10px',
          fontSize: '13.5px',
          outline: 'none',
          background: disabled ? '#F8FAFC' : '#FFFFFF',
          color: '#0F172A',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && (
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748B' }}>
          {hint}
        </p>
      )}
    </div>
  );
}

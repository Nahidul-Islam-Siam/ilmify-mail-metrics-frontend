'use client';

import type { HTMLInputTypeAttribute } from 'react';

interface FormInputProps {
  label?: string;
  type?: HTMLInputTypeAttribute;
  value?: string | number;
  onChange(value: string): void;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  min?: string | number;
  max?: string | number;
}

export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  hint,
  required = false,
  disabled = false,
  min,
  max
}: FormInputProps) {
  return (
    <div style={{ marginBottom: '18px' }}>
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
          {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
        </label>
      )}
      <input
        type={type}
        value={value !== undefined && value !== null ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        style={{
          width: '100%',
          padding: '10px 14px',
          border: '1px solid #CBD5E1',
          borderRadius: '10px',
          fontSize: '13.5px',
          outline: 'none',
          background: disabled ? '#F8FAFC' : '#FFFFFF',
          color: '#0F172A',
          transition: 'border-color 0.15s ease'
        }}
      />
      {hint && (
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748B' }}>
          {hint}
        </p>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';

export default function FileUpload({ label, currentUrl, onUpload, accept = 'image/*' }) {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (onUpload) onUpload(file);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '8px' }}>
          {label}
        </label>
      )}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        border: '1.5px dashed #CBD5E1',
        borderRadius: '12px',
        background: '#F8FAFC'
      }}>
        {currentUrl ? (
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            display: 'grid',
            placeItems: 'center',
            fontSize: '20px',
            overflow: 'hidden'
          }}>
            <img src={currentUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} onError={(e) => { e.target.style.display = 'none'; }} />
            <span style={{ fontSize: '20px' }}>🖼️</span>
          </div>
        ) : (
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            background: '#EFF6FF',
            color: '#2563EB',
            display: 'grid',
            placeItems: 'center',
            fontSize: '22px'
          }}>
            📁
          </div>
        )}

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
            {fileName || 'Choose image file'}
          </div>
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            PNG, SVG, ICO or JPG up to 2MB
          </div>
        </div>

        <label style={{
          background: '#FFFFFF',
          color: '#334155',
          border: '1px solid #CBD5E1',
          padding: '8px 14px',
          borderRadius: '8px',
          fontSize: '12.5px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}>
          Browse File
          <input type="file" accept={accept} onChange={handleFileChange} style={{ display: 'none' }} />
        </label>
      </div>
    </div>
  );
}

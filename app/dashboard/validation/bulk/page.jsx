'use client';

import { useState } from 'react';

export default function BulkValidationPage() {
  const [uploading, setUploading] = useState(false);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#101828', margin: '0 0 6px 0', fontFamily: "'Sora', sans-serif" }}>
          Bulk Validation
        </h1>
        <p style={{ fontSize: '13.5px', color: '#667085', margin: 0 }}>
          Upload a list and validate thousands of emails at once.
        </p>
      </div>

      {/* Drag and Drop Zone */}
      <div style={{
        background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0',
        padding: '36px', marginBottom: '24px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <div style={{
          border: '2px dashed #CBD5E1', borderRadius: '16px', padding: '36px 20px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#F8FAFC'
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px', background: '#F3E8FF',
            color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px'
          }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 16V4M8 8l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" strokeLinecap="round" />
            </svg>
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#101828', margin: '0 0 6px 0' }}>
            Drag & drop your file here
          </h3>
          <p style={{ fontSize: '13px', color: '#667085', margin: '0 0 16px 0' }}>
            or click to browse — up to 100,000 rows per upload
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{
              padding: '10px 22px', background: '#2563EB', color: '#fff', border: 'none',
              borderRadius: '10px', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}>
              Choose file
            </button>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['CSV', 'XLSX', 'XLS', 'TXT'].map((fmt, i) => (
                <span key={i} style={{ background: '#E2E8F0', color: '#475569', fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '6px' }}>
                  {fmt}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Live Stream */}
      <div style={{
        background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0',
        padding: '24px 28px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: '#101828', margin: '0 0 4px 0' }}>
              Processing — contacts_q3.csv
            </h3>
            <p style={{ fontSize: '12.5px', color: '#98A2B3', margin: 0 }}>
              50,000 rows · started just now
            </p>
          </div>
          <span style={{ background: '#FFFBEB', color: '#F59E0B', fontSize: '11.5px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px' }}>
            • Processing
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '6px', overflow: 'hidden', marginBottom: '8px' }}>
          <div style={{ height: '100%', width: '71%', background: '#7C3AED', borderRadius: '6px' }}></div>
        </div>
        <div style={{ fontSize: '12px', color: '#98A2B3', marginBottom: '20px', fontWeight: 600 }}>71% complete</div>

        {/* 5 Stats Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
          <div style={{ background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '12px', padding: '14px 16px' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#2563EB' }}>50,000</div>
            <div style={{ fontSize: '11.5px', color: '#667085', marginTop: '2px', fontWeight: 600 }}>Total Uploaded</div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '12px', padding: '14px 16px' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#101828' }}>35,748</div>
            <div style={{ fontSize: '11.5px', color: '#667085', marginTop: '2px', fontWeight: 600 }}>Processed</div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '12px', padding: '14px 16px' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#10B981' }}>32,816</div>
            <div style={{ fontSize: '11.5px', color: '#667085', marginTop: '2px', fontWeight: 600 }}>Valid</div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '12px', padding: '14px 16px' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#EF4444' }}>1,858</div>
            <div style={{ fontSize: '11.5px', color: '#667085', marginTop: '2px', fontWeight: 600 }}>Invalid</div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '12px', padding: '14px 16px' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#F59E0B' }}>1,072</div>
            <div style={{ fontSize: '11.5px', color: '#667085', marginTop: '2px', fontWeight: 600 }}>Risky</div>
          </div>
        </div>
      </div>

      {/* Export Bar */}
      <div style={{
        background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0',
        padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <div>
          <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: '#101828', margin: '0 0 2px 0' }}>Export results</h4>
          <p style={{ fontSize: '12.5px', color: '#98A2B3', margin: 0 }}>Download the cleaned list or sync it directly.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ padding: '9px 16px', background: '#FFFFFF', border: '1px solid #E4E7EC', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#344054', cursor: 'pointer' }}>
            ↓ Export CSV
          </button>
          <button style={{ padding: '9px 16px', background: '#FFFFFF', border: '1px solid #E4E7EC', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#344054', cursor: 'pointer' }}>
            ⤓ Export Excel
          </button>
          <button style={{ padding: '9px 18px', background: '#7C3AED', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
            ▤ Export to Google Sheet
          </button>
        </div>
      </div>

    </div>
  );
}

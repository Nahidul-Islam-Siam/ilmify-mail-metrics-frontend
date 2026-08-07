'use client';

import { useState, type FormEvent } from 'react';

interface SheetOption { id: string; name: string; createdTime?: string }
interface SheetSelectorProps {
  isOpen: boolean;
  sheets?: SheetOption[];
  activeSheetId?: string | null;
  onSelectSheet(id: string, name: string): void;
  onCreateNewSheet(title: string): void;
  onClose(): void;
  loading?: boolean;
}

export default function SheetSelector({
  isOpen,
  sheets = [],
  activeSheetId,
  onSelectSheet,
  onCreateNewSheet,
  onClose,
  loading = false
}: SheetSelectorProps) {
  const [newSheetTitle, setNewSheetTitle] = useState('');

  if (!isOpen) return null;

  const handleCreate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newSheetTitle.trim()) return;
    onCreateNewSheet(newSheetTitle.trim());
    setNewSheetTitle('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '600px' }}>
        
        {/* Modal Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0F172A', fontFamily: 'Sora, sans-serif' }}>
              Select Active Destination Google Sheet
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#64748B' }}>
              Choose a Google Spreadsheet to receive real-time email validation sync rows.
            </p>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '22px', cursor: 'pointer', color: '#64748B' }}>×</button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          
          {/* Create New Sheet Form */}
          <form onSubmit={handleCreate} style={{ marginBottom: '20px', padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '8px' }}>
              + Create New Google Spreadsheet Automatically
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="e.g. Email Validation Results 2026"
                value={newSheetTitle}
                onChange={(e) => setNewSheetTitle(e.target.value)}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  fontSize: '13px',
                  outline: 'none',
                  background: '#FFFFFF'
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#2563EB',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Create & Select
              </button>
            </div>
          </form>

          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>
            Available Google Spreadsheets in Drive ({sheets.length})
          </div>

          {loading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
              ⏳ Fetching spreadsheets from Google Drive API...
            </div>
          ) : sheets.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#64748B', fontSize: '13px', background: '#F8FAFC', borderRadius: '12px' }}>
              No spreadsheets found in your Drive. Use the form above to create one automatically.
            </div>
          ) : (
            <div style={{ maxHeight: '280px', overflowY: 'auto', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0 }}>
                    <th style={{ padding: '10px 14px', fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Sheet Name</th>
                    <th style={{ padding: '10px 14px', fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Created Date</th>
                    <th style={{ padding: '10px 14px', fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sheets.map((sheet) => {
                    const isSelected = activeSheetId === sheet.id;
                    return (
                      <tr key={sheet.id} style={{ borderBottom: '1px solid #F1F5F9', background: isSelected ? '#EFF6FF' : '#FFFFFF' }}>
                        <td style={{ padding: '12px 14px', fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
                          📊 {sheet.name}
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '12.5px', color: '#64748B' }}>
                          {sheet.createdTime ? sheet.createdTime.split('T')[0] : 'Aug 2026'}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                          {isSelected ? (
                            <span className="tag valid" style={{ fontSize: '11px' }}>
                              ✓ Active
                            </span>
                          ) : (
                            <button
                              onClick={() => onSelectSheet(sheet.id, sheet.name)}
                              className="btn-ghost btn-sm"
                              style={{ color: '#2563EB', fontWeight: 700 }}
                            >
                              Select
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

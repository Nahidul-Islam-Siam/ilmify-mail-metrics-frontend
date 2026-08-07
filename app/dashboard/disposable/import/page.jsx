'use client';

import { useState } from 'react';
import ProtectedRoute from '../../../../components/rbac/ProtectedRoute';

export default function BulkImportDisposableDomainsPage() {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const [parsedDomains, setParsedDomains] = useState([]);
  const [stats, setStats] = useState({ total: 0, newDomains: 0, duplicates: 0 });
  const [providerName, setProviderName] = useState('Bulk Imported Provider');
  const [category, setCategory] = useState('Disposable Email');
  const [importing, setImporting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const processFileContent = (content, name) => {
    setFileName(name);
    const lines = content.split(/[\r\n,]+/);
    const set = new Set();
    const list = [];
    let dupCount = 0;

    lines.forEach((line) => {
      const clean = line.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      if (clean && clean.includes('.')) {
        if (set.has(clean)) {
          dupCount++;
        } else {
          set.add(clean);
          list.push({ domain: clean, status: 'New' });
        }
      }
    });

    setParsedDomains(list);
    setStats({
      total: list.length + dupCount,
      newDomains: list.length,
      duplicates: dupCount
    });
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      processFileContent(e.target.result, file.name);
    };
    reader.readAsText(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmImport = async () => {
    if (parsedDomains.length === 0) return;

    setImporting(true);
    try {
      const domainList = parsedDomains.map(d => d.domain);
      const res = await fetch('http://localhost:4000/api/disposable-domains/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domains: domainList,
          provider_name: providerName,
          category: category
        })
      });

      if (res.ok) {
        const data = await res.json();
        setToastMessage(`✓ Successfully imported ${data.added} new disposable domains into database!`);
        setTimeout(() => setToastMessage(null), 4000);
        setParsedDomains([]);
        setStats({ total: 0, newDomains: 0, duplicates: 0 });
        setFileName('');
      }
    } catch (err) {
      setToastMessage('⚠️ Error carrying out import.');
    }
    setImporting(false);
  };

  return (
    <ProtectedRoute permission="user.view">
      <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>

        {/* Toast Notification */}
        {toastMessage && (
          <div style={{
            position: 'fixed', top: '20px', right: '20px', background: '#10B981', color: '#fff',
            padding: '12px 20px', borderRadius: '12px', fontSize: '13.5px', fontWeight: 700,
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)', zIndex: 200
          }}>
            {toastMessage}
          </div>
        )}

        {/* Page Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#101828', margin: '0 0 6px 0', fontFamily: "'Sora', sans-serif" }}>
            Bulk Import Disposable Domains
          </h1>
          <p style={{ fontSize: '13.5px', color: '#667085', margin: 0 }}>
            Upload CSV or TXT files to bulk import temporary email domains and validate duplicates.
          </p>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          style={{
            background: dragActive ? '#F4F3FF' : '#FFFFFF',
            border: `2px dashed ${dragActive ? '#7C3AED' : '#D0D5DD'}`,
            borderRadius: '20px', padding: '40px', textAlign: 'center', cursor: 'pointer',
            transition: 'all 0.2s ease', marginBottom: '24px'
          }}
        >
          <input
            type="file"
            id="fileInput"
            accept=".csv, .txt"
            onChange={(e) => handleFileUpload(e.target.files[0])}
            style={{ display: 'none' }}
          />

          <div style={{
            width: '54px', height: '54px', borderRadius: '16px', background: '#F3E8FF', color: '#7C3AED',
            fontSize: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px'
          }}>
            📂
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#101828', margin: '0 0 6px 0' }}>
            {fileName ? `File Loaded: ${fileName}` : 'Drag & Drop CSV or TXT File Here'}
          </h3>
          <p style={{ fontSize: '13px', color: '#667085', margin: '0 0 16px 0' }}>
            Supports domain lists separated by lines or commas (Max 10,000 domains per import)
          </p>

          <label
            htmlFor="fileInput"
            style={{
              padding: '10px 22px', background: '#7C3AED', color: '#fff', borderRadius: '10px',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'inline-block',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
            }}
          >
            Browse Computer Files
          </label>
        </div>

        {/* Import Summary & Preview Section */}
        {parsedDomains.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Stats Summary Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '18px' }}>
                <div style={{ fontSize: '12px', color: '#667085', fontWeight: 600 }}>Uploaded Total</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#101828', marginTop: '4px', fontFamily: "'Sora', sans-serif" }}>
                  {stats.total}
                </div>
              </div>

              <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '18px' }}>
                <div style={{ fontSize: '12px', color: '#667085', fontWeight: 600 }}>New Unique Domains</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#10B981', marginTop: '4px', fontFamily: "'Sora', sans-serif" }}>
                  {stats.newDomains}
                </div>
              </div>

              <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '18px' }}>
                <div style={{ fontSize: '12px', color: '#667085', fontWeight: 600 }}>Duplicates Filtered</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#F59E0B', marginTop: '4px', fontFamily: "'Sora', sans-serif" }}>
                  {stats.duplicates}
                </div>
              </div>
            </div>

            {/* Provider & Category Form Config */}
            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '20px', display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#344054', display: 'block', marginBottom: '6px' }}>Assign Provider Name</label>
                <input
                  type="text"
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', background: '#F8FAFC', border: '1px solid #E4E7EC', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#344054', display: 'block', marginBottom: '6px' }}>Assign Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', background: '#F8FAFC', border: '1px solid #E4E7EC', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="Temporary Email">Temporary Email</option>
                  <option value="Disposable Email">Disposable Email</option>
                  <option value="Burner Email">Burner Email</option>
                  <option value="Anonymous Email">Anonymous Email</option>
                </select>
              </div>
            </div>

            {/* Preview Table */}
            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#101828', margin: 0 }}>Import Preview ({parsedDomains.length} domains)</h3>
                <button
                  onClick={handleConfirmImport}
                  disabled={importing}
                  style={{
                    padding: '10px 24px', background: '#10B981', color: '#fff', border: 'none',
                    borderRadius: '10px', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  {importing ? 'Importing...' : '✓ Confirm & Import Domains'}
                </button>
              </div>

              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #EAECF0', textAlign: 'left', fontSize: '11px', color: '#98A2B3' }}>
                      <th style={{ padding: '8px' }}>#</th>
                      <th style={{ padding: '8px' }}>Domain</th>
                      <th style={{ padding: '8px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedDomains.slice(0, 50).map((d, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #F8FAFC' }}>
                        <td style={{ padding: '8px', fontSize: '12px', color: '#98A2B3' }}>{idx + 1}</td>
                        <td style={{ padding: '8px', fontSize: '13px', fontWeight: 700, fontFamily: 'monospace' }}>{d.domain}</td>
                        <td style={{ padding: '8px' }}>
                          <span style={{ background: '#ECFDF5', color: '#059669', fontSize: '10.5px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                            Ready
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}

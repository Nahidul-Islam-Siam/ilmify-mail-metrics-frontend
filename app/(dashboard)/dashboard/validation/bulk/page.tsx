'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import StatusBadge from '@/features/validation/components/StatusBadge';
import { validateBulkEmails, ValidationApiError } from '@/services/api/validationApi';
import type { BulkValidationResult, EmailValidationResult } from '@/features/validation/types';
import { usePermission } from '@/features/auth/usePermission';

type ProcessingState = 'idle' | 'processing' | 'complete' | 'error';

function parseEmails(content: string): string[] {
  return Array.from(
    new Set(
      content
        .split(/[\s,;]+/)
        .map((value) => value.trim().toLowerCase())
        .filter((value) => value.includes('@')),
    ),
  );
}

function csvCell(value: string | number): string {
  return `"${String(value).replace(/"/g, '""')}"`;
}

export default function BulkValidationPage() {
  const { token, refreshAccessToken } = usePermission();
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<ProcessingState>('idle');
  const [filename, setFilename] = useState('');
  const [result, setResult] = useState<BulkValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setFilename(file.name);
    setResult(null);
    setError(null);

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'csv' && extension !== 'txt') {
      setState('error');
      setError('Choose a CSV or TXT file.');
      return;
    }

    const emails = parseEmails(await file.text());
    if (emails.length === 0) {
      setState('error');
      setError('No email addresses were found in this file.');
      return;
    }
    if (emails.length > 1000) {
      setState('error');
      setError(`This MVP accepts up to 1,000 unique emails; the file contains ${emails.length}.`);
      return;
    }

    setState('processing');
    try {
      try {
        setResult(await validateBulkEmails(emails, token));
      } catch (requestError) {
        if (!(requestError instanceof ValidationApiError) || requestError.status !== 401) throw requestError;
        const refreshedToken = await refreshAccessToken();
        if (!refreshedToken) throw requestError;
        setResult(await validateBulkEmails(emails, refreshedToken));
      }
      setState('complete');
    } catch (requestError) {
      setState('error');
      setError(requestError instanceof Error ? requestError.message : 'Bulk validation failed');
    }
  }

  function downloadResults() {
    if (!result) return;
    const header = ['email', 'normalizedEmail', 'status', 'score', 'reasons', 'checkedAt'];
    const rows = result.results.map((row) => [
      row.email,
      row.normalizedEmail,
      row.status,
      row.score,
      row.reasons.join('|'),
      row.checkedAt,
    ]);
    const csv = [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mailmetric-validation-results.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  const stats: Array<[string, number, string]> = result
    ? [
        ['Processed', result.processed, '#2563EB'],
        ['Valid', result.valid, '#10B981'],
        ['Invalid', result.invalid, '#EF4444'],
        ['Risky', result.risky, '#F59E0B'],
        ['Unknown', result.unknown, '#667085'],
      ]
    : [];

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#101828', marginBottom: 6 }}>Bulk Validation</h1>
        <p style={{ color: '#667085', margin: 0 }}>Upload a CSV or TXT file containing up to 1,000 email addresses.</p>
      </header>

      <section style={{ background: '#fff', border: '1px solid #EAECF0', borderRadius: 18, padding: 28, textAlign: 'center' }}>
        <input ref={inputRef} type="file" accept=".csv,.txt,text/csv,text/plain" onChange={handleFile} hidden />
        <div style={{ border: '2px dashed #CBD5E1', borderRadius: 14, padding: 34, background: '#F8FAFC' }}>
          <h2 style={{ fontSize: 17, marginTop: 0 }}>Choose an email list</h2>
          <p style={{ color: '#667085', fontSize: 13 }}>{filename || 'CSV and TXT files are supported'}</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={state === 'processing'}
            style={{ border: 0, borderRadius: 10, padding: '11px 22px', background: '#7C3AED', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
          >
            {state === 'processing' ? 'Validating…' : 'Choose file'}
          </button>
        </div>
      </section>

      {error && <p role="alert" style={{ color: '#B42318', background: '#FEF3F2', padding: 14, borderRadius: 10 }}>{error}</p>}

      {result && (
        <section style={{ marginTop: 22, display: 'grid', gap: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            {stats.map(([label, value, color]) => (
              <div key={label} style={{ background: '#fff', border: '1px solid #EAECF0', borderRadius: 12, padding: 16 }}>
                <strong style={{ display: 'block', fontSize: 24, color }}>{value}</strong>
                <span style={{ color: '#667085', fontSize: 12 }}>{label}</span>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', border: '1px solid #EAECF0', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EAECF0' }}>
              <strong>Validation results</strong>
              <button type="button" onClick={downloadResults} style={{ border: '1px solid #D0D5DD', borderRadius: 8, padding: '8px 14px', background: '#fff', fontWeight: 600 }}>
                Download CSV
              </button>
            </div>
            <div style={{ overflowX: 'auto', maxHeight: 520 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead><tr>{['Email', 'Status', 'Score', 'Reasons'].map((title) => <th key={title} style={{ textAlign: 'left', padding: 12, background: '#F8FAFC' }}>{title}</th>)}</tr></thead>
                <tbody>
                  {result.results.map((row: EmailValidationResult) => (
                    <tr key={`${row.email}-${row.checkedAt}`} style={{ borderTop: '1px solid #EAECF0' }}>
                      <td style={{ padding: 12 }}>{row.normalizedEmail}</td>
                      <td style={{ padding: 12 }}><StatusBadge status={row.status} /></td>
                      <td style={{ padding: 12 }}>{row.score}</td>
                      <td style={{ padding: 12, color: '#667085' }}>{row.reasons.join(', ') || 'None'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

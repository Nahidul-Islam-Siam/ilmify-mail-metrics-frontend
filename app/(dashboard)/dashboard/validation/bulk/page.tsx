'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { validateBulkEmails, ValidationApiError } from '@/services/api/validationApi';
import type { BulkValidationResult, EmailValidationResult } from '@/features/validation/types';
import { usePermission } from '@/features/auth/usePermission';
import { createEmailTemplateWorkbook, parseWorkbookEmails } from '@/features/validation/bulkWorkbook';
import { getValidationBadges } from '@/features/validation/validationPresentation';
import {
  createExportFilename,
  createValidationCsv,
  createValidationWorkbook,
  filterValidationResults,
  type ExportFilter,
} from '@/features/validation/validationExport';

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

export default function BulkValidationPage() {
  const { token, refreshAccessToken } = usePermission();
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<ProcessingState>('idle');
  const [filename, setFilename] = useState('');
  const [result, setResult] = useState<BulkValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exportFilter, setExportFilter] = useState<ExportFilter>('all');

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setFilename(file.name);
    setResult(null);
    setError(null);
    setExportFilter('all');

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'csv' && extension !== 'txt' && extension !== 'xlsx') {
      setState('error');
      setError('Choose a CSV, TXT, or XLSX file.');
      return;
    }

    let emails: string[];
    try {
      emails = extension === 'xlsx'
        ? await parseWorkbookEmails(await file.arrayBuffer())
        : parseEmails(await file.text());
    } catch {
      setState('error');
      setError('This Excel file could not be read. Upload a valid .xlsx workbook.');
      return;
    }
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

  async function downloadTemplate() {
    setError(null);
    try {
      const workbook = await createEmailTemplateWorkbook();
      const url = URL.createObjectURL(new Blob([workbook], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mailmetric-email-template.xlsx';
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('The Excel template could not be created. Please try again.');
    }
  }

  function downloadBlob(blob: Blob, downloadFilename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFilename;
    link.style.display = 'none';
    document.body.appendChild(link);
    try {
      link.click();
    } finally {
      URL.revokeObjectURL(url);
      link.remove();
    }
  }

  function downloadCsv() {
    if (filteredResults.length === 0) return;
    setError(null);
    try {
      downloadBlob(
        new Blob([createValidationCsv(filteredResults)], { type: 'text/csv;charset=utf-8' }),
        createExportFilename(exportFilter, 'csv'),
      );
    } catch {
      setError('The CSV export could not be created. Please try again.');
    }
  }

  async function downloadExcel() {
    if (filteredResults.length === 0) return;
    setError(null);
    try {
      const workbook = await createValidationWorkbook(filteredResults);
      downloadBlob(
        new Blob([workbook], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        createExportFilename(exportFilter, 'xlsx'),
      );
    } catch {
      setError('The Excel export could not be created. Please try again.');
    }
  }

  const filteredResults = result ? filterValidationResults(result.results, exportFilter) : [];

  const stats: Array<[string, number, string]> = result
    ? [
        ['Processed', result.processed, '#2563EB'],
        ['Deliverable', result.deliverable, '#10B981'],
        ['Undeliverable', result.undeliverable, '#EF4444'],
        ['Risky', result.risky, '#F59E0B'],
        ['Unknown', result.unknown, '#667085'],
      ]
    : [];

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#101828', marginBottom: 6 }}>Bulk Validation</h1>
        <p style={{ color: '#667085', margin: 0 }}>Upload a CSV, TXT, or XLSX file containing up to 1,000 email addresses.</p>
      </header>

      <section style={{ background: '#fff', border: '1px solid #EAECF0', borderRadius: 18, padding: 28, textAlign: 'center' }}>
        <input ref={inputRef} type="file" accept=".csv,.txt,.xlsx,text/csv,text/plain,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={handleFile} hidden />
        <div style={{ border: '2px dashed #CBD5E1', borderRadius: 14, padding: 34, background: '#F8FAFC' }}>
          <h2 style={{ fontSize: 17, marginTop: 0 }}>Choose an email list</h2>
          <p style={{ color: '#667085', fontSize: 13, marginBottom: 6 }}>{filename || 'CSV, TXT, and XLSX files are supported'}</p>
          <p style={{ color: '#475467', fontSize: 13, marginTop: 0 }}>Put one email per row under the <strong>email</strong> column.</p>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10 }}>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={state === 'processing'}
            style={{ border: 0, borderRadius: 10, padding: '11px 22px', background: '#7C3AED', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
          >
            {state === 'processing' ? 'Validating…' : 'Choose file'}
          </button>
            <button
              type="button"
              onClick={downloadTemplate}
              disabled={state === 'processing'}
              style={{ border: '1px solid #7C3AED', borderRadius: 10, padding: '10px 18px', background: '#fff', color: '#6D28D9', fontWeight: 700, cursor: 'pointer' }}
            >
              Download Excel template
            </button>
          </div>
          <p style={{ color: '#667085', fontSize: 12, margin: '14px 0 0' }}>Google Sheets: File → Download → Microsoft Excel (.xlsx), then upload it here.</p>
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
            <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, borderBottom: '1px solid #EAECF0' }}>
              <div>
                <strong style={{ display: 'block' }}>Validation results</strong>
                <span style={{ color: '#667085', fontSize: 12 }}>{filteredResults.length} matching results</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <label htmlFor="export-filter" style={{ fontSize: 12, fontWeight: 600, color: '#475467' }}>Export</label>
                <select
                  id="export-filter"
                  value={exportFilter}
                  onChange={(event) => setExportFilter(event.target.value as ExportFilter)}
                  style={{ border: '1px solid #D0D5DD', borderRadius: 8, padding: '8px 10px', background: '#fff', color: '#344054' }}
                >
                  <option value="all">All results</option>
                  <option value="valid">Valid only</option>
                  <option value="invalid">Invalid only</option>
                  <option value="risky">Risky only</option>
                  <option value="unknown">Unknown only</option>
                </select>
                <button type="button" onClick={downloadCsv} disabled={filteredResults.length === 0} style={{ border: '1px solid #D0D5DD', borderRadius: 8, padding: '8px 14px', background: '#fff', fontWeight: 600, cursor: filteredResults.length === 0 ? 'not-allowed' : 'pointer', opacity: filteredResults.length === 0 ? 0.5 : 1 }}>
                  Export CSV
                </button>
                <button type="button" onClick={downloadExcel} disabled={filteredResults.length === 0} style={{ border: 0, borderRadius: 8, padding: '9px 14px', background: '#7C3AED', color: '#fff', fontWeight: 600, cursor: filteredResults.length === 0 ? 'not-allowed' : 'pointer', opacity: filteredResults.length === 0 ? 0.5 : 1 }}>
                  Export Excel
                </button>
              </div>
            </div>
            <div style={{ overflowX: 'auto', maxHeight: 520 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead><tr>{['Email', 'Deliverability', 'Email type', 'Verification', 'Score', 'Reasons'].map((title) => <th key={title} style={{ textAlign: 'left', padding: 12, background: '#F8FAFC' }}>{title}</th>)}</tr></thead>
                <tbody>
                  {result.results.map((row: EmailValidationResult) => (
                    <tr key={`${row.email}-${row.checkedAt}`} style={{ borderTop: '1px solid #EAECF0' }}>
                      <td style={{ padding: 12 }}>{row.normalizedEmail}</td>
                      {getValidationBadges(row).map((badge) => (
                        <td key={badge.label} style={{ padding: 12, color: '#344054', fontWeight: 600 }}>{badge.label}</td>
                      ))}
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

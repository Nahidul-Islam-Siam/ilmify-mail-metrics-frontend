'use client';

import { useState, type FormEvent } from 'react';
import CheckResultCard from '@/features/validation/components/CheckResultCard';
import StatusBadge from '@/features/validation/components/StatusBadge';
import ProtectedRoute from '@/components/rbac/ProtectedRoute';
import { validateSingleEmail, ValidationApiError } from '@/services/api/validationApi';
import type { EmailValidationResult } from '@/features/validation/types';
import { usePermission } from '@/features/auth/usePermission';
import {
  EMPTY_EMAIL_WARNING,
  getSingleValidationInputWarning,
} from '@/features/validation/singleValidationInput';

const CHECK_LABELS: Record<keyof EmailValidationResult['checks'], string> = {
  syntax: 'Syntax',
  required: 'Required field',
  length: 'Maximum length',
  atSign: 'Exactly one @',
  localPart: 'Local part',
  domainPart: 'Domain part',
  tld: 'Top-level domain',
  spaces: 'No spaces',
  characters: 'Allowed characters',
  consecutiveDots: 'No consecutive dots',
  dotPosition: 'Dot position',
  rfc: 'RFC-compatible syntax',
  dns: 'DNS',
  mx: 'MX records',
  disposable: 'Disposable domain',
  publicProvider: 'Public email provider',
  blacklist: 'Internal blacklist',
  roleAccount: 'Role account',
  smtp: 'SMTP mailbox',
  ownership: 'Ownership verification',
};

export default function SingleValidationDashboardPage() {
  const { token, refreshAccessToken } = usePermission();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const inputWarning = getSingleValidationInputWarning(email);
    if (inputWarning) {
      setError(inputWarning);
      setResult(null);
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      try {
        setResult(await validateSingleEmail(email, token));
      } catch (requestError) {
        if (!(requestError instanceof ValidationApiError) || requestError.status !== 401) throw requestError;
        const refreshedToken = await refreshAccessToken();
        if (!refreshedToken) throw requestError;
        setResult(await validateSingleEmail(email, refreshedToken));
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Validation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute permission="user.view">
      <main style={{ maxWidth: 1000, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
        <header style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#101828', marginBottom: 6 }}>Single Email Validation</h1>
          <p style={{ color: '#667085', margin: 0 }}>Check all syntax, DNS/MX, reputation, blacklist, ownership, and optional SMTP rules.</p>
        </header>

        <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #EAECF0', borderRadius: 18, padding: 24, display: 'flex', gap: 12 }}>
          <input
            type="text"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error === EMPTY_EMAIL_WARNING) setError(null);
            }}
            placeholder="person@example.com"
            style={{ flex: 1, padding: '12px 14px', border: '1px solid #D0D5DD', borderRadius: 10, fontSize: 14 }}
          />
          <button type="submit" disabled={loading} style={{ padding: '12px 24px', border: 0, borderRadius: 10, background: '#7C3AED', color: '#fff', fontWeight: 700 }}>
            {loading ? 'Validating…' : 'Validate email'}
          </button>
        </form>

        {error && <p role="alert" style={{ color: '#B42318', background: '#FEF3F2', padding: 14, borderRadius: 10 }}>{error}</p>}

        {result && (
          <section style={{ marginTop: 24, display: 'grid', gap: 20 }}>
            <div style={{ background: '#fff', border: '1px solid #EAECF0', borderRadius: 18, padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#667085', fontSize: 12 }}>RESULT FOR</div>
                <h2 style={{ margin: '5px 0' }}>{result.normalizedEmail}</h2>
                <p style={{ color: '#667085', margin: 0 }}>{result.reasons.length ? result.reasons.join(', ') : 'No risk signals found'}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong style={{ display: 'block', fontSize: 30, marginBottom: 8 }}>{result.score}/100</strong>
                <StatusBadge status={result.status} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
              {(Object.entries(result.checks) as [keyof EmailValidationResult['checks'], string][]).map(([name, status]) => (
                <CheckResultCard key={name} title={CHECK_LABELS[name]} status={status} />
              ))}
            </div>
          </section>
        )}
      </main>
    </ProtectedRoute>
  );
}

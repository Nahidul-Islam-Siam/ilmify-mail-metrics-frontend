'use client';

import { useState, type FormEvent } from 'react';
import CheckResultCard from '@/features/validation/components/CheckResultCard';
import StatusBadge from '@/features/validation/components/StatusBadge';
import ProtectedRoute from '@/components/rbac/ProtectedRoute';
import { validateSingleEmail } from '@/services/api/validationApi';
import type { EmailValidationResult } from '@/features/validation/types';
import { usePermission } from '@/features/auth/usePermission';

const CHECK_LABELS: Record<keyof EmailValidationResult['checks'], string> = {
  syntax: 'Syntax',
  dns: 'DNS',
  mx: 'MX records',
  disposable: 'Disposable domain',
  publicProvider: 'Public email provider',
  roleAccount: 'Role account',
  smtp: 'SMTP mailbox',
};

export default function SingleValidationDashboardPage() {
  const { token } = usePermission();
  const [email, setEmail] = useState('test@example.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      setResult(await validateSingleEmail(email, true, token));
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
          <p style={{ color: '#667085', margin: 0 }}>Check syntax, DNS, MX, disposable domains, role accounts, and SMTP.</p>
        </header>

        <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #EAECF0', borderRadius: 18, padding: 24, display: 'flex', gap: 12 }}>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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

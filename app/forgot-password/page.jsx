'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg, #0B0F19)',
      color: '#fff',
      fontFamily: "'Inter', sans-serif",
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '36px 32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(12px)'
      }}>
        
        {/* Header Icon */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Link href="/" title="Go to Home" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
              boxShadow: '0 8px 20px rgba(99,102,241,0.3)'
            }}>
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
          </Link>
          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px 0', fontFamily: "'Sora', sans-serif" }}>
            Reset your password
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>
            Enter your account email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {submitted ? (
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>✉️</div>
            <h4 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 700, color: '#4ADE80' }}>
              Check your inbox
            </h4>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5 }}>
              We sent a password reset link to <b style={{ color: '#fff' }}>{email}</b>.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.16)',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Resend link
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: '#CBD5E1' }}>
                Account Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '13.5px',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 700,
                cursor: loading ? 'wait' : 'pointer',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
              }}
            >
              {loading ? 'Sending link...' : 'Send reset link'}
            </button>
          </form>
        )}

        {/* Back to Sign In link */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link
            href="/login"
            style={{
              color: '#818CF8',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ← Back to Sign in
          </Link>
        </div>

      </div>
    </div>
  );
}

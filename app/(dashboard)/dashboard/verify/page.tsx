'use client';

import { useState, type FormEvent } from 'react';
import ProtectedRoute from '@/components/rbac/ProtectedRoute';

export default function EmailVerificationPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifState, setVerifState] = useState<'success' | 'failed' | null>(null);

  const handleSendOtp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };


  const handleVerifyOtp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (otp === '123456' || otp.length === 6) {
        setVerifState('success');
      } else {
        setVerifState('failed');
      }
      setStep(3);
    }, 1200);
  };

  const handleReset = () => {
    setStep(1);
    setEmail('');
    setOtp('');
    setVerifState(null);
  };

  return (
    <ProtectedRoute permission="user.view">
      <div style={{ maxWidth: '640px', margin: '40px auto', fontFamily: "'Inter', sans-serif" }}>

        {/* Stepper Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          {[
            { num: 1, label: 'Enter Email' },
            { num: 2, label: 'Send OTP' },
            { num: 3, label: 'Verified' }
          ].map((s) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: step >= s.num ? '#7C3AED' : '#F1F5F9',
                color: step >= s.num ? '#FFFFFF' : '#64748B',
                fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {s.num}
              </div>
              <span style={{ fontSize: '13px', fontWeight: step === s.num ? 700 : 500, color: step === s.num ? '#101828' : '#98A2B3' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #EAECF0', padding: '36px', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#101828', margin: '0 0 6px 0', fontFamily: "'Sora', sans-serif" }}>
              Step 1: Enter Target Email
            </h2>
            <p style={{ fontSize: '13.5px', color: '#667085', margin: '0 0 24px 0' }}>
              Enter the email address you wish to verify via OTP / Magic Link.
            </p>

            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#344054', display: 'block', marginBottom: '6px' }}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  required
                  style={{ width: '100%', padding: '12px 14px', background: '#F8FAFC', border: '1px solid #E4E7EC', borderRadius: '12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '12px', background: '#7C3AED', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)' }}
              >
                {loading ? 'Sending OTP...' : 'Send Verification OTP →'}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: Enter OTP Code */}
        {step === 2 && (
          <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #EAECF0', padding: '36px', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#101828', margin: '0 0 6px 0', fontFamily: "'Sora', sans-serif" }}>
              Step 2: Enter OTP Verification Code
            </h2>
            <p style={{ fontSize: '13.5px', color: '#667085', margin: '0 0 24px 0' }}>
              A 6-digit OTP code was sent to <b>{email}</b>. (Demo Code: <code>123456</code>)
            </p>

            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#344054', display: 'block', marginBottom: '6px' }}>6-Digit Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  required
                  style={{ width: '100%', padding: '12px 14px', background: '#F8FAFC', border: '1px solid #E4E7EC', borderRadius: '12px', fontSize: '18px', fontWeight: 800, letterSpacing: '0.2em', textAlign: 'center', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{ flex: 1, padding: '12px', background: '#F8FAFC', border: '1px solid #E4E7EC', borderRadius: '12px', fontSize: '13.5px', fontWeight: 700, color: '#344054', cursor: 'pointer' }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ flex: 2, padding: '12px', background: '#7C3AED', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {loading ? 'Verifying...' : 'Verify OTP Code'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: Verification Result Screen */}
        {step === 3 && (
          <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #EAECF0', padding: '40px', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
            {verifState === 'success' ? (
              <>
                <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#ECFDF5', color: '#059669', fontSize: '28px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  ✓
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#065F46', margin: '0 0 8px 0', fontFamily: "'Sora', sans-serif" }}>
                  Email Ownership Verified!
                </h2>
                <p style={{ fontSize: '14px', color: '#047857', margin: '0 0 24px 0' }}>
                  The mailbox <b>{email}</b> is confirmed active and owned by the user.
                </p>
              </>
            ) : (
              <>
                <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#FEF2F2', color: '#DC2626', fontSize: '28px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  ✕
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#991B1B', margin: '0 0 8px 0', fontFamily: "'Sora', sans-serif" }}>
                  Verification Failed
                </h2>
                <p style={{ fontSize: '14px', color: '#7F1D1D', margin: '0 0 24px 0' }}>
                  The OTP code entered was invalid or expired.
                </p>
              </>
            )}

            <button
              onClick={handleReset}
              style={{ padding: '12px 28px', background: '#7C3AED', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
            >
              Verify Another Email
            </button>
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}

'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  
  // Basic strength calculator for UI demo
  const getStrength = (pass) => {
    if (!pass) return 0;
    if (pass.length < 6) return 1;
    if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) return 3;
    return 2;
  };
  
  const strength = getStrength(password);

  return (
    <>
      <div className="auth-header">
        <h1>Change password</h1>
        <p>Create a new password for your account.</p>
      </div>

      <form action="/auth/login">
        <div className="form-group">
          <label>New Password</label>
          <div className="input-wrap">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <input 
              type="password" 
              placeholder="Create a strong password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {password && (
            <div className="pass-strength" data-score={strength}>
              <i></i><i></i><i></i>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <div className="input-wrap">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <input type="password" placeholder="Repeat your new password" required />
          </div>
        </div>

        <button type="submit" className="auth-btn" style={{ marginTop: '28px' }}>
          Reset Password
        </button>
      </form>

      <div className="auth-links" style={{ justifyContent: 'center' }}>
        <Link href="/auth/login" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg viewBox="0 0 24 24" fill="none" style={{ width: '16px', height: '16px' }}>
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to sign in
        </Link>
      </div>
    </>
  );
}

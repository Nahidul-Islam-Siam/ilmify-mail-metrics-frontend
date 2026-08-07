'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [password, setPassword] = useState('');
  
  // Basic strength calculator for UI demo
  const getStrength = (pass: string): number => {
    if (!pass) return 0;
    if (pass.length < 6) return 1;
    if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) return 3;
    return 2;
  };
  
  const strength = getStrength(password);

  return (
    <>
      <div className="auth-header">
        <h1>Create an account</h1>
        <p>Start validating emails for free</p>
      </div>

      <form>
        <div className="form-group">
          <label>Full name</label>
          <div className="input-wrap">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <input type="text" placeholder="John Doe" required />
          </div>
        </div>

        <div className="form-group">
          <label>Email address</label>
          <div className="input-wrap">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            <input type="email" placeholder="john@company.com" required />
          </div>
        </div>

        <div className="form-group">
          <label>Password</label>
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

        <button type="submit" className="auth-btn" style={{ marginTop: '28px' }}>
          Create Account
        </button>
      </form>

      <div className="auth-links">
        <span className="sub">Already have an account?</span>
        <Link href="/auth/login">Sign in</Link>
      </div>
    </>
  );
}

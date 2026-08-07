import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="auth-header">
        <h1>Reset password</h1>
        <p>Enter your email and we'll send you an OTP to reset your password.</p>
      </div>

      <form action="/auth/verify-otp">
        <div className="form-group">
          <label>Email address</label>
          <div className="input-wrap">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            <input type="email" placeholder="john@company.com" required />
          </div>
        </div>

        <button type="submit" className="auth-btn" style={{ marginTop: '28px' }}>
          Send OTP
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

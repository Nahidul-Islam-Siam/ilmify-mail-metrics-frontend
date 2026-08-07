import Link from 'next/link';

export default function LoginPage() {
  return (
    <>
      <div className="auth-header">
        <h1>Welcome back</h1>
        <p>Sign in to your MailMetric account</p>
      </div>

      <form>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ margin: 0 }}>Password</label>
            <Link href="/auth/forgot-password" style={{ fontSize: '12px', fontWeight: '600', color: 'var(--blue-accent)', textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </div>
          <div className="input-wrap" style={{ marginTop: '8px' }}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <input type="password" placeholder="••••••••" required />
          </div>
        </div>

        <button type="submit" className="auth-btn">
          Sign In
        </button>
      </form>

      <div className="auth-links">
        <span className="sub">Don't have an account?</span>
        <Link href="/auth/signup">Create an account</Link>
      </div>
    </>
  );
}

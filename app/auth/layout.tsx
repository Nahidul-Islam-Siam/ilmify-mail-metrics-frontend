import './auth.css';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Authentication — iLMIFY MailMetric',
};

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="auth-root">
      {/* Left Sidebar (Desktop only) */}
      <div className="auth-sidebar">
        <Link href="/" className="auth-brand">
          <div className="mk">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          iLMIFY MailMetric
        </Link>
        
        <div className="auth-quote">
          <h2>Ensure your emails<br/>actually land.</h2>
          <p>Join thousands of businesses that rely on MailMetric for real-time validation, risk scoring, and protecting their sender reputation.</p>
        </div>
      </div>
      
      {/* Right Main Form Area */}
      <main className="auth-main">
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <Link href="/" className="auth-mobile-brand">
            <div className="mk" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #2B4BFF, #5b78ff)', color: '#fff', display: 'grid', placeItems: 'center' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            iLMIFY MailMetric
          </Link>
          
          <div className="auth-card">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

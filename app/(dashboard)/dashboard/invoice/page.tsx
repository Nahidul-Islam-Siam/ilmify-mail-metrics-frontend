"use client";

import { icons } from '@/components/dashboard/Icons';
import type { ReactNode } from 'react';

const QrSvg = () => {
  const g = [
    "1111111011101111111",
    "1000001010101000001",
    "1011101001101011101",
    "1011101110101011101",
    "1011101010001011101",
    "1000001011001000001",
    "1111111010101111111",
    "0000000011100000000",
    "1101011101011010110",
    "0100110010110101001",
    "1011101110001110111",
    "0010010101101001010",
    "1110111011010111011",
    "0000000100110101101",
    "1111111010101101011",
    "1000001110011010010",
    "1011101011101110110",
    "1011101001010011001",
    "1111111011011101011"
  ];
  const cell = 6.8;
  const rects: ReactNode[] = [];
  g.forEach((row, y) => {
    row.split('').forEach((c, x) => {
      if (c === '1') {
        rects.push(
          <rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} fill="#0F172A" />
        );
      }
    });
  });

  return (
    <svg viewBox={`0 0 ${19 * 6.8} ${19 * 6.8}`} width="100%">
      {rects}
    </svg>
  );
};

export default function InvoicePage() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Invoices</h1>
          <p className="page-sub">Download receipts and preview your latest A4 invoice.</p>
        </div>
        <div className="actions">
          <button className="btn btn-ghost" onClick={() => window.print()}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M12 3v12M8 11l4 4 4-4M4 21h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download PDF / Print
          </button>
          <button className="btn btn-primary" onClick={() => alert('Invoice emailed successfully!')}>Email invoice</button>
        </div>
      </div>
      <div className="invoice-shell">
        <div className="a4">
          <div className="inv-top">
            <div className="inv-brand">
              <div className="lm" style={{ color: '#fff', width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2.2">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <b>iLMIFY MailMetric</b>
                <span>Email Intelligence Platform</span>
              </div>
            </div>
            <div>
              <h2 className="inv-word">INVOICE</h2>
              <div className="inv-meta">
                <b>#MM-2026-0842</b><br />
                Issued: Aug 1, 2026<br />
                Due: Aug 8, 2026
              </div>
            </div>
          </div>
          <div className="inv-parties">
            <div>
              <div className="lbl2">Billed to</div>
              <p>
                <b>Acme Inc.</b><br />
                John Doe<br />
                142 Market Street<br />
                San Francisco, CA 94103<br />
                john@acme.com
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="lbl2">From</div>
              <p>
                <b>iLMIFY Technologies</b><br />
                Dhaka, Bangladesh<br />
                billing@mailmetric.io<br />
                VAT: BD-4482091
              </p>
            </div>
          </div>
          <table className="inv-table">
            <thead>
              <tr>
                <th>Description</th>
                <th className="r">Qty</th>
                <th className="r">Unit</th>
                <th className="r">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <b>Business Plan</b> — monthly subscription<br />
                  <span style={{ color: 'var(--muted)', fontSize: '11px' }}>100,000 validations / month</span>
                </td>
                <td className="r">1</td>
                <td className="r">$99.00</td>
                <td className="r">$99.00</td>
              </tr>
              <tr>
                <td>API overage — 12,000 extra requests</td>
                <td className="r">12</td>
                <td className="r">$1.50</td>
                <td className="r">$18.00</td>
              </tr>
              <tr>
                <td>AI Insights add-on</td>
                <td className="r">1</td>
                <td className="r">$15.00</td>
                <td className="r">$15.00</td>
              </tr>
            </tbody>
          </table>
          <div className="inv-total">
            <div className="tt">
              <div className="tr"><span>Subtotal</span><span>$132.00</span></div>
              <div className="tr"><span>Tax (5%)</span><span>$6.60</span></div>
              <div className="tr grand"><span>Total due</span><span>$138.60</span></div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="card qr-pay">
            <h3 className="section-title" style={{ justifyContent: 'center', marginBottom: '2px' }}>Single QR Payment</h3>
            <p className="section-sub">Scan to pay $138.60 instantly</p>
            <div className="qr">
              <QrSvg />
            </div>
            <span className="tag valid" style={{ margin: '0 auto' }}>One-tap secure payment</span>
          </div>
          <div className="card" style={{ padding: '18px' }}>
            <h3 className="section-title" style={{ marginBottom: '12px' }}>Payment methods</h3>
            <div className="pay-methods">
              <div className="pm">
                <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M3 9h18" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                Visa •••• 4242 
                <span style={{ marginLeft: 'auto', color: 'var(--ok, #10B981)', fontSize: '11px', fontWeight: 700 }}>Default</span>
              </div>
              <div className="pm">
                <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                Bank transfer
              </div>
              <div className="pm">
                <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                  <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M8 8h4v4H8zM8 14h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                Single QR Gateway
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

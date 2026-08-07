'use client';

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
  const rects = [];
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
    <svg viewBox={`0 0 ${19 * 6.8} ${19 * 6.8}`} width="140" height="140">
      {rects}
    </svg>
  );
};

export default function InvoicesPage() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#101828', margin: '0 0 6px 0', fontFamily: "'Sora', sans-serif" }}>
            Invoices
          </h1>
          <p style={{ fontSize: '13.5px', color: '#667085', margin: 0 }}>
            Download receipts and preview your latest invoice.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => window.print()} style={{
            padding: '9px 16px', background: '#FFFFFF', border: '1px solid #E4E7EC', borderRadius: '10px',
            fontSize: '13px', fontWeight: 600, color: '#344054', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3v12M8 11l4 4 4-4M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download PDF
          </button>
          
          <button onClick={() => alert('Invoice emailed successfully!')} style={{
            padding: '9px 18px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '10px',
            fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
          }}>
            Email invoice
          </button>
        </div>
      </div>

      {/* Main Grid: Left A4 Invoice + Right Payment Cards */}
      <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>
        
        {/* Left A4 Invoice Card */}
        <div style={{
          flex: 1, minWidth: 0, background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0',
          padding: '36px 40px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          
          {/* Invoice Top */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #EAECF0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #7C3AED, #6366F1)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="2.5" />
                  <path d="M4 7l8 6 8-6" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#101828', fontFamily: "'Sora', sans-serif" }}>iLMIFY MailMetric</div>
                <div style={{ fontSize: '12px', color: '#98A2B3' }}>Email Intelligence Platform</div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#101828', margin: '0 0 6px 0', letterSpacing: '0.05em' }}>INVOICE</h2>
              <div style={{ fontSize: '12px', color: '#667085', lineHeight: 1.5 }}>
                <b style={{ color: '#101828' }}>#MM-2026-0842</b><br />
                Issued: Aug 1, 2026<br />
                Due: Aug 8, 2026
              </div>
            </div>
          </div>

          {/* Billed To & From */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px', fontSize: '13px', lineHeight: 1.6 }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#98A2B3', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>BILLED TO</div>
              <div style={{ fontWeight: 800, color: '#101828' }}>Acme Inc.</div>
              <div style={{ color: '#475467' }}>John Doe</div>
              <div style={{ color: '#475467' }}>142 Market Street</div>
              <div style={{ color: '#475467' }}>San Francisco, CA 94103</div>
              <div style={{ color: '#667085' }}>john@acme.com</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#98A2B3', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>FROM</div>
              <div style={{ fontWeight: 800, color: '#101828' }}>iLMIFY Technologies</div>
              <div style={{ color: '#475467' }}>Dhaka, Bangladesh</div>
              <div style={{ color: '#667085' }}>billing@mailmetric.io</div>
              <div style={{ color: '#98A2B3', fontSize: '12px' }}>VAT: BD-4482091</div>
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #EAECF0', textAlign: 'left', fontSize: '11px', color: '#98A2B3', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 14px', borderRadius: '8px 0 0 8px' }}>DESCRIPTION</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>QTY</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>UNIT</th>
                <th style={{ padding: '12px 14px', textAlign: 'right', borderRadius: '0 8px 8px 0' }}>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #F2F4F7', fontSize: '13px', color: '#344054' }}>
                <td style={{ padding: '14px' }}>
                  <b style={{ color: '#101828' }}>Business Plan</b> — monthly subscription<br />
                  <span style={{ fontSize: '11.5px', color: '#98A2B3' }}>100,000 validations / month</span>
                </td>
                <td style={{ padding: '14px', textAlign: 'center', fontWeight: 600 }}>1</td>
                <td style={{ padding: '14px', textAlign: 'right', fontWeight: 600 }}>$99.00</td>
                <td style={{ padding: '14px', textAlign: 'right', fontWeight: 700, color: '#101828' }}>$99.00</td>
              </tr>

              <tr style={{ borderBottom: '1px solid #F2F4F7', fontSize: '13px', color: '#344054' }}>
                <td style={{ padding: '14px' }}>
                  <b style={{ color: '#101828' }}>API overage</b> — 12,000 extra requests
                </td>
                <td style={{ padding: '14px', textAlign: 'center', fontWeight: 600 }}>12</td>
                <td style={{ padding: '14px', textAlign: 'right', fontWeight: 600 }}>$1.50</td>
                <td style={{ padding: '14px', textAlign: 'right', fontWeight: 700, color: '#101828' }}>$18.00</td>
              </tr>

              <tr style={{ borderBottom: '1px solid #F2F4F7', fontSize: '13px', color: '#344054' }}>
                <td style={{ padding: '14px' }}>
                  <b style={{ color: '#101828' }}>AI Insights add-on</b>
                </td>
                <td style={{ padding: '14px', textAlign: 'center', fontWeight: 600 }}>1</td>
                <td style={{ padding: '14px', textAlign: 'right', fontWeight: 600 }}>$15.00</td>
                <td style={{ padding: '14px', textAlign: 'right', fontWeight: 700, color: '#101828' }}>$15.00</td>
              </tr>
            </tbody>
          </table>

          {/* Totals Section */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#667085' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: '#101828' }}>$132.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#667085', paddingBottom: '10px', borderBottom: '1px solid #EAECF0' }}>
                <span>Tax (5%)</span>
                <span style={{ fontWeight: 600, color: '#101828' }}>$6.60</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, color: '#101828', paddingTop: '4px' }}>
                <span>Total due</span>
                <span>$138.60</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Payment Cards Column */}
        <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '20px', flexShrink: 0 }}>
          
          {/* Card 1: Pay with QR */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px 20px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: '#101828', margin: '0 0 2px 0' }}>Pay with QR</h4>
            <p style={{ fontSize: '11.5px', color: '#98A2B3', margin: '0 0 16px 0' }}>Scan to pay $138.60 instantly</p>

            <div style={{
              background: '#FFFFFF', border: '1px solid #E4E7EC', borderRadius: '16px', padding: '16px',
              display: 'inline-flex', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <QrSvg />
            </div>

            <div style={{ background: '#ECFDF5', color: '#10B981', fontSize: '11.5px', fontWeight: 700, padding: '6px 12px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              • One-tap secure payment
            </div>
          </div>

          {/* Card 2: Payment Methods */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px 20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: '#101828', margin: '0 0 16px 0' }}>Payment methods</h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', border: '1px solid #E4E7EC', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#344054" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#101828' }}>Visa •••• 4242</span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981' }}>Default</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#F8FAFC', border: '1px solid #E4E7EC', borderRadius: '10px' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#344054" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#344054' }}>Bank transfer</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#F8FAFC', border: '1px solid #E4E7EC', borderRadius: '10px' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#344054" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <line x1="12" y1="18" x2="12" y2="18" strokeWidth="3" />
                </svg>
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#344054' }}>Mobile / QR wallet</span>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

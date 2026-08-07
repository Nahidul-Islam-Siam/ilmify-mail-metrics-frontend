'use client';

export default function SyncHistoryTable({ logs = [] }) {
  return (
    <div className="card" style={{ padding: '28px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: 0, marginBottom: '6px', fontFamily: 'Sora, sans-serif' }}>
        Google Sheets Sync History Log
      </h3>
      <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
        Audit history of email validation batch results synced to Google Sheets.
      </p>

      {logs.length === 0 ? (
        <div style={{ padding: '36px', textAlign: 'center', color: '#64748B', background: '#F8FAFC', borderRadius: '12px', fontSize: '13.5px' }}>
          📂 No validation sync jobs recorded yet. Run a validation task to see sync logs here!
        </div>
      ) : (
        <div style={{ overflowX: 'auto', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Date & Time</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Job / Sheet ID</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Records</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Success</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Failed</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 16px', fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
                    📅 {new Date(log.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    <span style={{ fontSize: '11.5px', color: '#64748B', display: 'block', fontWeight: 400 }}>
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#334155' }}>
                    <div style={{ fontWeight: 700 }}>Validation Results</div>
                    <div style={{ fontSize: '11.5px', color: '#64748B', fontFamily: 'monospace' }}>ID: {log.sheet_id.substring(0, 14)}...</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                    {log.total_records.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 700, color: '#166534' }}>
                    {log.synced_records.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 700, color: log.failed_records > 0 ? '#DC2626' : '#64748B' }}>
                    {log.failed_records}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {log.status === 'completed' ? (
                      <span className="tag valid">Completed</span>
                    ) : log.status === 'partial' ? (
                      <span className="tag warn">Partial</span>
                    ) : (
                      <span className="tag bad">Failed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

'use client';

export default function ScoreTable({ rules = [], onUpdateScore, onToggleStatus }) {
  return (
    <div style={{ overflowX: 'auto', border: '1px solid #E2E8F0', borderRadius: '14px', marginTop: '16px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
            <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Rule Name</th>
            <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Risk Penalty (+Score)</th>
            <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Status</th>
            <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <tr key={rule.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                {rule.rule_name}
              </td>
              <td style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#EF4444' }}>+</span>
                  <input
                    type="number"
                    value={rule.score}
                    onChange={(e) => onUpdateScore(rule.id, parseInt(e.target.value, 10) || 0)}
                    style={{
                      width: '76px',
                      padding: '6px 10px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 700,
                      outline: 'none'
                    }}
                  />
                  <span style={{ fontSize: '12px', color: '#64748B' }}>points</span>
                </div>
              </td>
              <td style={{ padding: '14px 16px' }}>
                {rule.status === 'active' ? (
                  <span className="tag valid">Active</span>
                ) : (
                  <span className="tag warn">Disabled</span>
                )}
              </td>
              <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                <button
                  onClick={() => onToggleStatus(rule.id, rule.status === 'active' ? 'disabled' : 'active')}
                  className="btn-ghost btn-sm"
                >
                  {rule.status === 'active' ? 'Disable' : 'Enable'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

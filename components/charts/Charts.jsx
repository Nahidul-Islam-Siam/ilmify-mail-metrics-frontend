import React from 'react';

export function BarChart({ data, opts = {} }) {
  const w = opts.w || 560;
  const h = opts.h || 220;
  const pad = 28;
  const bw = (w - pad * 2) / data.length;
  
  let maxVal = Math.max(...data.map(d => d.v));
  if (maxVal === 0) maxVal = 1; // prevent divide by zero
  const max = maxVal * 1.15;

  const gridLines = [];
  for (let i = 1; i <= 4; i++) {
    const y = h - pad - ((h - pad * 1.4) * (i / 4));
    gridLines.push(
      <line key={`grid-${i}`} x1={pad} y1={y} x2={w - pad} y2={y} stroke="#EEF2F7" />
    );
  }

  const bars = data.map((d, i) => {
    const bh = (h - pad * 1.4) * (d.v / max);
    const x = pad + bw * i + bw * 0.22;
    const bwid = bw * 0.56;
    const y = h - pad - bh;
    return (
      <g key={`bar-${i}`}>
        <rect x={x} y={y} width={bwid} height={bh} rx="5" fill="url(#gbar)">
          <animate attributeName="height" from="0" to={bh} dur="0.7s" fill="freeze" />
          <animate attributeName="y" from={h - pad} to={y} dur="0.7s" fill="freeze" />
        </rect>
        <text x={pad + bw * i + bw / 2} y={h - 8} textAnchor="middle" fontSize="10.5" fill="#94A3B8" fontFamily="Inter">
          {d.l}
        </text>
      </g>
    );
  });

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%">
      <defs>
        <linearGradient id="gbar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7C3AED" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      {gridLines}
      {bars}
    </svg>
  );
}

export function AreaChart({ data, opts = {} }) {
  const w = opts.w || 560;
  const h = opts.h || 220;
  const pad = 28;
  
  let maxVal = Math.max(...data.map(d => d.v));
  if (maxVal === 0) maxVal = 1;
  const max = maxVal * 1.15;
  const min = 0;
  
  const step = (w - pad * 2) / (data.length - 1);
  const pts = data.map((d, i) => [pad + step * i, h - pad - ((h - pad * 1.4) * ((d.v - min) / (max - min)))]);

  const gridLines = [];
  for (let i = 1; i <= 4; i++) {
    const y = h - pad - ((h - pad * 1.4) * (i / 4));
    gridLines.push(
      <line key={`grid-${i}`} x1={pad} y1={y} x2={w - pad} y2={y} stroke="#EEF2F7" />
    );
  }

  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = line + ` L${pts[pts.length - 1][0]} ${h - pad} L${pts[0][0]} ${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%">
      <defs>
        <linearGradient id="garea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2563EB" stopOpacity=".22" />
          <stop offset="1" stopColor="#2563EB" stopOpacity="0" />
        </linearGradient>
      </defs>
      {gridLines}
      <path d={area} fill="url(#garea)" />
      <path d={line} fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={`dot-${i}`}>
          <circle cx={p[0]} cy={p[1]} r="3.5" fill="#2563EB" stroke="#fff" strokeWidth="2" />
          <text x={p[0]} y={h - 8} textAnchor="middle" fontSize="10.5" fill="#94A3B8" fontFamily="Inter">
            {data[i].l}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function DonutChart({ segments, opts = {} }) {
  const size = opts.size || 168;
  const r = 62;
  const cx = size / 2;
  const cy = size / 2;
  const C = 2 * Math.PI * r;
  
  const total = segments.reduce((a, s) => a + s.v, 0);
  let off = 0;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F5F9" strokeWidth="18" />
      {segments.map((s, i) => {
        const frac = s.v / total;
        const len = C * frac;
        const currentOff = off;
        off += len;
        
        return (
          <circle
            key={`seg-${i}`}
            cx={cx} cy={cy} r={r}
            fill="none" stroke={s.c} strokeWidth="18"
            strokeDasharray={`${len} ${C - len}`}
            strokeDashoffset={-currentOff}
            transform={`rotate(-90 ${cx} ${cy})`}
            strokeLinecap="butt"
          />
        );
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="26" fontWeight="800" fill="#0F172A" fontFamily="'Plus Jakarta Sans'">
        {opts.big || total}
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" fontSize="10.5" fill="#94A3B8" fontFamily="Inter">
        {opts.label || ''}
      </text>
    </svg>
  );
}

export function Ring({ pct, opts = {} }) {
  const size = opts.size || 172;
  const r = 74;
  const cx = size / 2;
  const cy = size / 2;
  const C = 2 * Math.PI * r;
  const len = C * (pct / 100);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <defs>
        <linearGradient id="gring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7C3AED" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F5F9" strokeWidth="13" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#gring)" strokeWidth="13" strokeLinecap="round" strokeDasharray={`${len} ${C}`}>
        <animate attributeName="stroke-dasharray" from={`0 ${C}`} to={`${len} ${C}`} dur="1s" fill="freeze" />
      </circle>
    </svg>
  );
}

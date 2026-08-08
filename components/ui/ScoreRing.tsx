export default function ScoreRing({ score = 0 }: { score?: number }) {
  const r = 42;
  const C = 2 * Math.PI * r;
  const len = (C * score) / 100;
  return (
    <div className="ring">
      <svg viewBox="0 0 96 96" width="96" height="96">
        <defs>
          <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8CF0B0" />
            <stop offset="1" stopColor="#4E6BFF" />
          </linearGradient>
        </defs>
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="9" />
        <circle cx="48" cy="48" r={r} fill="none" stroke="url(#rg)" strokeWidth="9" strokeLinecap="round"
          strokeDasharray={`${len} ${C}`}>
          <animate attributeName="stroke-dasharray" from={`0 ${C}`} to={`${len} ${C}`} dur="0.9s" fill="freeze" />
        </circle>
      </svg>
      <div className="rc">{score}</div>
    </div>
  );
}

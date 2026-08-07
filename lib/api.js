// In Next, NEXT_PUBLIC_API_BASE is inlined at build time. Empty → relative '/api'
// which hits the rewrite in next.config.js (same-origin, no CORS).
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/+$/, '');

const DISPOSABLE = ['tempmail.io','temp-mail.org','mailinator.com','10minutemail.com','guerrillamail.com','throwaway.email','trashmail.com','yopmail.com','getnada.com','fakeinbox.com'];
const ROLE = ['info','admin','support','noreply','no-reply','contact','sales','office','billing','hello'];

// Offline fallback so the demo still works if the backend is unreachable.
export function localValidate(v) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const fmtOk = re.test(v);
  const domain = v.split('@')[1] || '';
  const local = v.split('@')[0] || '';
  const isDisp = DISPOSABLE.includes(domain);
  const isRole = ROLE.includes(local);
  const hasDot = domain.includes('.');
  let score = 0;
  if (fmtOk) score += 45;
  if (fmtOk && !isDisp) score += 30;
  if (fmtOk && hasDot) score += 15;
  if (!isRole) score += 10;
  if (isDisp) score = Math.min(score, 18);
  if (!fmtOk) score = Math.min(score, 8);
  const status = !fmtOk ? 'invalid' : isDisp ? 'disposable' : isRole ? 'risky' : 'valid';
  return { score, status, disposable: isDisp, live: false,
    checks: { format: fmtOk ? 'pass' : 'fail', mx: (fmtOk && hasDot) ? 'pass' : 'fail' } };
}

export async function validateEmail(email) {
  const v = (email || '').trim().toLowerCase();
  try {
    const res = await fetch(`${API_BASE}/api/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: v }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { ...data, live: true };
  } catch {
    return localValidate(v);
  }
}

'use client';
import { useEffect, useCallback, useRef, type RefObject } from 'react';
import { validateEmailThunk, setLastEmail } from '../store/validationSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { ValidationStatus } from '../types/validation';
import ScoreRing from './ScoreRing.jsx';

const COL = { ok: '#8CF0B0', bad: '#ff9a9a', warn: '#ffd479' };

const VERDICT: Record<ValidationStatus, readonly [string, string, string]> = {
  valid:      ['Safe to send', '#22C55E', 'rgba(34,197,94,.16)'],
  risky:      ['Verify first', '#F59E0B', 'rgba(245,158,11,.16)'],
  disposable: ['Block it',     '#EF4444', 'rgba(239,68,68,.16)'],
  invalid:    ['Do not send',  '#EF4444', 'rgba(239,68,68,.16)'],
};

function CheckRow({ state, label }: { state: boolean | 'skip'; label: string }) {
  const c = state === true ? COL.ok : state === 'skip' ? COL.warn : COL.bad;
  return (
    <span>
      <svg viewBox="0 0 24 24" fill="none">
        {state === true
          ? <path d="M5 13l4 4L19 7" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          : <path d="M7 7l10 10M17 7L7 17" stroke={c} strokeWidth="2.4" strokeLinecap="round" />}
      </svg>
      {label}
    </span>
  );
}

export default function LiveValidator({ inputRef }: { inputRef?: RefObject<HTMLInputElement> }) {
  const dispatch = useAppDispatch();
  const { lastEmail: email, lastResult: result, busy } = useAppSelector((state) => state.validation);
  const localRef = useRef<HTMLInputElement>(null);
  const ref = inputRef || localRef;

  const run = useCallback(() => {
    const v = email.trim().toLowerCase();
    if (!v || busy) return;
    dispatch(validateEmailThunk(v));
  }, [email, busy, dispatch]);

  useEffect(() => {
    if (result) return; // Skip initial run if we have persisted results
    const t = setTimeout(run, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verdict = VERDICT[result?.status ?? 'valid'];
  const mx = result?.checks?.mx;

  return (
    <div className="glass checker-card" style={{ transform: 'translateY(-14px)' }}>
      <span className="chk-badge">MailMetric Live Check</span>
      <h3 className="chk-title">Validating <b>200+</b> signals<br />in real-time</h3>
      <p className="chk-desc">Format · domain · MX · disposable · AI score</p>

      <div className="chk-input">
        <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" /><path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        <input
          ref={ref}
          type="email"
          value={email}
          onChange={(e) => dispatch(setLastEmail(e.target.value))}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          placeholder="Enter an email…"
        />
        <button onClick={run}>{busy ? '…' : 'Validate'}</button>
      </div>

      <div className={`chk-result${result ? ' show' : ''}`}>
        {result && (
          <>
            <ScoreRing score={result.score} />
            <div className="chk-verdict">
              <b>{verdict[0]}</b>
              <span className="vtag" style={{ color: verdict[1], background: verdict[2] }}>
                {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
              </span>
              <div className="vlist">
                <CheckRow state={result.checks.format === 'pass'} label="Format & syntax" />
                <CheckRow state={mx === 'pass' ? true : mx === 'skipped' ? 'skip' : false} label="Domain & MX" />
                <CheckRow state={!result.disposable} label="Not disposable" />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="satisfied">
        <div className="faces"><i></i><i></i><i></i></div>
        <div><b>99.2% accuracy</b><span>Trusted by 8,000+ senders</span></div>
      </div>
    </div>
  );
}

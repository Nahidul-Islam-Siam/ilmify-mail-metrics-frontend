'use client';
import { useRef, Fragment } from 'react';
import Icon from './Icons';
import Navbar from './Navbar';
import LiveValidator from './LiveValidator';
import { stats } from '../data/content';

export default function Hero() {
  const emailRef = useRef<HTMLInputElement>(null);

  const focusDemo = () => {
    emailRef.current?.focus();
    emailRef.current?.select();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="hero">
      <Navbar />

      <div className="wrap hero-content">
        <span className="eyebrow">
          <svg className="spark" viewBox="0 0 24 24" fill="none"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" fill="#a9bcff" /></svg>
          Powered by <b>&nbsp;MailMetric&nbsp;AI</b>
        </span>
        <h1 className="hero-title">
          Verify Every Email
          <div className="line2">Before You Send
            <span className="ic-badge">
              <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="2.5" stroke="#fff" strokeWidth="2" /><path d="M4 8l8 5 8-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" /><path d="M15.5 15l1.6 1.6 3-3" stroke="#8CF0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </div>
        </h1>
        <p className="hero-sub">Catch invalid, disposable, and risky addresses in real time — protect your sender reputation and stop paying to email people who'll never receive it.</p>
        <div className="hero-ctas">
          <button className="btn-primary" onClick={focusDemo}>
            Validate an email now <span className="arw"><Icon name="arrow" /></span>
          </button>
          <a href="#how" className="btn-outline">See how it works</a>
        </div>
      </div>

      <div className="wrap">
        <div className="hero-cards">
          <div className="glass credits" style={{ marginTop: '34px' }}>
            <div className="ctop">
              <div className="clabel">Your MailMetric<br />credits</div>
              <span className="pill-ready">● Ready</span>
            </div>
            <div className="cnum">154,320</div>
            <div className="csub">of 250,000 this cycle</div>
            <div className="next-reward">
              <span className="nr-ic"><Icon name="bolt" /></span>
              <div><b>Next tier</b><span>+50k credits at 200k</span></div>
              <span className="nr-arw"><Icon name="arrow" /></span>
            </div>
          </div>

          <LiveValidator inputRef={emailRef} />

          <div className="glass caught" style={{ marginTop: '34px' }}>
            <span className="ctag">
              <svg viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M9.5 12l1.5 1.5 3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Caught just now
            </span>
            <div className="clast">Blocked at signup</div>
            <div className="cbig">noreply@tempmail.io</div>
            <div className="cmeta">Disposable domain · risk score 12/100</div>
            <div className="cshield">
              <svg viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            </div>
          </div>
        </div>

        <div className="hero-stats">
          {stats.map((s, i) => (
            <Fragment key={s.label}>
              {i > 0 && <span className="hdiv"></span>}
              <div className="hstat"><b>{s.value}</b><span>{s.label}</span></div>
            </Fragment>
          ))}
        </div>
      </div>

      <div className="curve">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,120 L0,60 C240,120 480,120 720,80 C960,40 1200,0 1440,40 L1440,120 Z" fill="#ffffff" />
        </svg>
      </div>
    </header>
  );
}

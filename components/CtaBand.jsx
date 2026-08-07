'use client';
import Icon from './Icons.jsx';
import { useToast } from './ToastProvider.jsx';

export default function CtaBand() {
  const onToast = useToast();
  return (
    <section className="cta-band">
      <div className="wrap">
        <div className="cta-inner">
          <h2>Clean your list before your next campaign</h2>
          <p>Start free with 100 validations a month — no card required. Scale to millions with the API when you're ready.</p>
          <button className="btn-primary" onClick={() => onToast('Starting your free workspace…')}>
            Get started free <span className="arw"><Icon name="arrow" /></span>
          </button>
        </div>
      </div>
    </section>
  );
}

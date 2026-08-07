'use client';
import { useState } from 'react';
import Icon from './Icons.jsx';
import SectionHead from './SectionHead.jsx';
import { faqs } from '../data/content.js';

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="faq" id="faq">
      <div className="wrap">
        <SectionHead chip="FAQ" title="Questions, answered" sub="Everything you need to know about validating email with MailMetric." />
        <div className="faq-list">
          {faqs.map(([q, a], i) => (
            <div className={`faq-item${open === i ? ' open' : ''}`} key={q}>
              <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
                {q}
                <span className="fq-ic"><Icon name="plus" /></span>
              </button>
              <div className="faq-a" style={{ maxHeight: open === i ? '220px' : '0' }}>
                <p>{a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

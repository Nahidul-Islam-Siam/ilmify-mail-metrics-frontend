'use client';
import { useState } from 'react';
import { useToast } from './ToastProvider';
import Icon from './Icons';
import SectionHead from './SectionHead';
import { plans } from '../data/content';

export default function Pricing() {
  const onToast = useToast();
  const [cycle, setCycle] = useState('monthly');
  return (
    <section className="pricing" id="pricing">
      <div className="wrap">
        <SectionHead
          chip="Pricing"
          title="Simple pricing that scales with your list"
          sub="Start free and upgrade when you grow. Every plan includes real-time verification and the AI quality score."
        >
          <div className="toggle">
            <button className={cycle === 'monthly' ? 'on' : ''} onClick={() => setCycle('monthly')}>Monthly</button>
            <button className={cycle === 'yearly' ? 'on' : ''} onClick={() => setCycle('yearly')}>
              Yearly <span className="save">2 months free</span>
            </button>
          </div>
        </SectionHead>

        <div className="plans">
          {plans.map((p) => (
            <div className={`plan${p.popular ? ' popular' : ''}`} key={p.name}>
              {p.popular && <span className="ptag">Most popular</span>}
              <div className="pname">{p.name}</div>
              <div className="price">${cycle === 'monthly' ? p.monthly : p.yearly}<small>/mo</small></div>
              <div className="pdesc">{p.desc}</div>
              <ul>
                {p.features.map((f) => (
                  <li key={f}><Icon name="check" /> {f}</li>
                ))}
              </ul>
              <button className={`pbtn ${p.variant}`} onClick={() => onToast(`Choosing ${p.name}…`)}>{p.cta}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

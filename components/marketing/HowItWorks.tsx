import Icon from '@/components/ui/Icons';
import SectionHead from '@/components/ui/SectionHead';
import { steps } from '@/data/content';

export default function HowItWorks() {
  return (
    <section className="how" id="how">
      <div className="wrap">
        <SectionHead
          chip="How It Works"
          title="From messy list to clean inbox in four steps"
          sub="No setup, no code required to start. Drop in an address or a whole file and MailMetric does the rest."
        />
        <div className="steps">
          {steps.map((s, i) => (
            <div className="step" key={s.title}>
              <div className="snum">{i + 1}</div>
              <span className="sic"><Icon name={s.icon} /></span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

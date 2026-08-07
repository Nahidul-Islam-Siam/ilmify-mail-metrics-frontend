import Icon from './Icons';
import SectionHead from './SectionHead';
import { features } from '../data/content';

export default function Features() {
  return (
    <section className="features" id="features">
      <div className="wrap">
        <SectionHead
          chip="AI Features"
          title="AI-Powered Validation, Deliverability Made Effortless"
          sub="Every send starts with a clean list. MailMetric's AI verifies, scores, and protects your email data so more messages actually reach the inbox."
        />
        <div className="f-grid">
          {features.map((f) => (
            <div className={`f-card${f.featured ? ' feat' : ''}`} key={f.title}>
              <div className="f-ic"><Icon name={f.icon} /></div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <a href="#" className="f-more">Learn more <Icon name="arrow" /></a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

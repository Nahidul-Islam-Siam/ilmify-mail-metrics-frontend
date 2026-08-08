import Icon from '@/components/ui/Icons';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap foot-inner">
        <div className="foot-brand"><span className="mk"><Icon name="logo" /></span> MailMetric</div>
        <nav className="foot-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#how">How It Works</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="foot-copy">© 2026 iLMIFY MailMetric</div>
      </div>
    </footer>
  );
}

import Link from 'next/link';
import Icon from './Icons.jsx';

export default function Navbar() {
  return (
    <div className="wrap nav">
      <div className="nav-inner">
        <Link className="brand" href="/">
          <span className="mk"><Icon name="logo" /></span>
          MailMetric
        </Link>
        <nav className="nav-menu">
          <Link href="/" className="active">Home</Link>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#how">How It Works</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="nav-right">
          <Link href="/login" className="login">Log In</Link>
          <Link href="/dashboard" className="btn-pill">Dashboard</Link>
          <button className="hamb" aria-label="Menu">
            <svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

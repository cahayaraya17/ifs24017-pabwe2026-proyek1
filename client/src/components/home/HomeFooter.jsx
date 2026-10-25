import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function BottomCta() {
  return (
    <section className="bottom-cta container">
      <div>
        <span className="eyebrow">YOUR CAMPUS JOURNEY STARTS HERE</span>
        <h2>
          Don't just attend college.
          <br />
          <span className="gradient-text">Experience it.</span>
        </h2>
      </div>
      <Link className="button" to="/login">
        Get started <ArrowRight size={17} />
      </Link>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer container">
      <Link to="/" className="brand footer-brand">
        <span className="brand-mark">
          <Sparkles size={18} />
        </span>
        <span>
          Campus<span className="brand-accent">Pulse</span>
        </span>
      </Link>
      <span>Made for campus life · CampusPulse MVP</span>
    </footer>
  );
}

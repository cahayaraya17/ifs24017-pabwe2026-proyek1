import { ArrowRight, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

function HeroVisual() {
  return (
    <div className="hero-visual">
      <div className="visual-glow" />
      <Link to={ROUTES.MAP} className="floating-label label-top map-cta">
        <span className="live-indicator" /> Happening on campus <ArrowRight size={14} />
      </Link>

      <Link
        to={ROUTES.MAP}
        className="visual-card visual-card-main map-visual-link"
        aria-label="Buka peta kampus"
      >
        <div className="visual-card-top">
          <span className="tiny-tag">FEATURED EVENT</span>
          <span className="visual-date">CAMPUS LIFE</span>
        </div>
        <div className="visual-illustration campus-photo-frame">
          <img
            className="campus-hero-photo"
            src="/images/itdel-campus-aerial.webp"
            alt="Pemandangan area kampus Institut Teknologi Del dari udara"
          />
          <div className="campus-photo-overlay" />
          <span className="campus-photo-caption">
            <span className="live-indicator" /> INSTITUT TEKNOLOGI DEL
          </span>
        </div>
        <div className="visual-card-copy">
          <div>
            <span className="muted small">SITOLUAMA · TOBA · SUMATERA UTARA</span>
            <h3>Our campus, our stories.</h3>
          </div>
          <span className="visual-arrow">
            <ArrowRight size={18} />
          </span>
        </div>
      </Link>

      <div className="floating-label label-bottom">
        <span className="floating-icon">
          <Users size={16} />
        </span>
        <span>
          <strong>Find your people</strong>
          <small>Communities that inspire</small>
        </span>
      </div>
      <div className="decor decor-one">✳</div>
      <div className="decor decor-two">✦</div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="hero container">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="pulse-dot" /> THE HEARTBEAT OF YOUR CAMPUS
        </div>
        <h1>
          Your campus.
          <br />
          <span className="gradient-text">Your pulse.</span>
        </h1>
        <p className="hero-description">
          Temukan acara seru, komunitas baru, dan kesempatan yang bikin kehidupan kampusmu lebih
          bermakna.
        </p>
        <div className="hero-actions">
          <a href="#discover" className="button">
            <Sparkles size={17} /> Explore events <ArrowRight size={17} />
          </a>
          <Link to={ROUTES.REGISTER} className="button button-ghost">
            Join the community
          </Link>
        </div>
        <div className="hero-social-proof">
          <div className="mini-avatars">
            <span>A</span>
            <span>B</span>
            <span>C</span>
          </div>
          <span>
            <strong>One campus.</strong> Endless possibilities.
          </span>
        </div>
      </div>
      <HeroVisual />
    </section>
  );
}

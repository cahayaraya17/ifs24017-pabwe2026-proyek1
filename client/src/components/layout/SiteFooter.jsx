import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export default function SiteFooter() {
  return (
    <footer className="footer container">
      <Link to={ROUTES.HOME} className="brand footer-brand">
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

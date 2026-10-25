import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export default function BottomCta() {
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
      <Link className="button" to={ROUTES.LOGIN}>
        Get started <ArrowRight size={17} />
      </Link>
    </section>
  );
}

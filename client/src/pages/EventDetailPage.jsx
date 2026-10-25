import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import StatePanel from '../components/common/StatePanel';
import EventInfoGrid from '../components/events/EventInfoGrid';
import RegistrationPanel from '../components/events/RegistrationPanel';
import { ROUTES } from '../constants/routes';
import { useEventDetail } from '../hooks/useEventDetail';

function DetailPlaceholder({ children, variant }) {
  return (
    <main className="container page-pad">
      <h1 className="sr-only">Detail acara</h1>
      <StatePanel variant={variant}>{children}</StatePanel>
    </main>
  );
}

export default function EventDetailPage({ user }) {
  const { id } = useParams();
  const { event, error, message, busy, register } = useEventDetail(id, user);

  if (!event && !error) return <DetailPlaceholder>Memuat detail acara...</DetailPlaceholder>;

  if (error && !event) {
    return (
      <DetailPlaceholder variant="error-state">
        {error}
        <p>
          <Link to={ROUTES.HOME}>Kembali</Link>
        </p>
      </DetailPlaceholder>
    );
  }

  return (
    <main className="container detail-page">
      <Link to={ROUTES.HOME} className="back-link">
        <ArrowLeft size={16} /> Semua acara
      </Link>
      <div className="detail-layout">
        <section className="detail-main">
          <div className="detail-art">
            <span className="category-pill">{event.category_name}</span>
            <div className="detail-art-shape" />
            <span className="detail-art-label">CAMPUSPULSE EVENTS</span>
          </div>
          <span className="eyebrow">{event.category_name || 'CAMPUS EVENT'}</span>
          <h1>{event.title}</h1>
          <p className="detail-description">{event.description}</p>
          <EventInfoGrid event={event} />
        </section>
        <RegistrationPanel
          event={event}
          message={message}
          error={error}
          busy={busy}
          onRegister={register}
        />
      </div>
    </main>
  );
}

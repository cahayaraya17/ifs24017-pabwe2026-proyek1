import { Link, useNavigate, useParams } from 'react-router-dom';
import EventInfoGrid from '../components/event-detail/EventInfoGrid';
import RegistrationPanel from '../components/event-detail/RegistrationPanel';
import StatePanel from '../components/StatePanel';
import { useEventDetail } from '../hooks/useEventDetail';
import { ArrowLeft } from 'lucide-react';

function DetailShell({ children }) {
  return (
    <main className="container page-pad">
      <h1 className="sr-only">Detail acara</h1>
      {children}
    </main>
  );
}

export default function EventDetailPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { event, error, message, busy, register } = useEventDetail(id);

  function handleRegister() {
    if (!user) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }
    register();
  }

  if (!event && !error) {
    return (
      <DetailShell>
        <StatePanel>Memuat detail acara...</StatePanel>
      </DetailShell>
    );
  }

  if (error && !event) {
    return (
      <DetailShell>
        <StatePanel variant="error">
          {error}
          <p>
            <Link to="/">Kembali</Link>
          </p>
        </StatePanel>
      </DetailShell>
    );
  }

  return (
    <main className="container detail-page">
      <Link to="/" className="back-link">
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
          onRegister={handleRegister}
        />
      </div>
    </main>
  );
}

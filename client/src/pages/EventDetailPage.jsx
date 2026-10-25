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
<<<<<<< HEAD

  if (!event && !error) return <main className="container page-pad"><h1 className="sr-only">Detail acara</h1><div className="state-panel">Memuat detail acara...</div></main>;
  if (error && !event) return <main className="container page-pad"><h1 className="sr-only">Detail acara</h1><div className="state-panel error-state">{error}<p><Link to="/">Kembali</Link></p></div></main>;
  const date=new Date(event.start_at);
  return <main className="container detail-page">
    <Link to="/" className="back-link"><ArrowLeft size={16}/> Semua acara</Link>
    <div className="detail-layout"><section className="detail-main"><div className="detail-art"><span className="category-pill">{event.category_name}</span><div className="detail-art-shape"/><span className="detail-art-label">CAMPUSPULSE EVENTS</span></div><span className="eyebrow">{event.category_name || 'CAMPUS EVENT'}</span><h1>{event.title}</h1><p className="detail-description">{event.description}</p><div className="detail-info-grid"><div><CalendarDays/><span><small>Tanggal</small><strong>{date.toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</strong></span></div><div><Clock/><span><small>Waktu</small><strong>{date.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}</strong></span></div><div><MapPin/><span><small>Lokasi</small><strong>{event.location}</strong></span></div><div><Users/><span><small>Peserta</small><strong>{event.registered_count} / {event.capacity}</strong></span></div></div></section>
      <aside className="registration-panel"><span className="eyebrow">SAVE YOUR SPOT</span><h2>Be part of it.</h2><p className="muted">Daftar dan jadikan acara ini bagian dari pengalaman kampusmu.</p><div className="capacity-bar"><span style={{width:`${Math.min(100,(event.registered_count/event.capacity)*100)}%`}}/></div><small className="muted">{Math.max(0,event.capacity-event.registered_count)} tempat tersisa</small>{message && <div className="success-message"><CheckCircle2 size={17}/>{message}</div>}{error && <div className="form-error">{error}</div>}<button className="button button-full" disabled={busy || event.status!=='published' || event.registered_count>=event.capacity} onClick={register}>{busy?'Memproses...':event.registered_count>=event.capacity?'Kuota penuh':'Register for event'}</button><small className="muted panel-footnote">Pendaftaran mengikuti kuota yang tersedia.</small></aside>
    </div>
  </main>;

=======
>>>>>>> 3b0c4bcce212ac047aec4e37c5901947d5274b3e
}

import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays, MapPin, Users, Clock, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';

export default function EventDetailPage({ user }) {
  const { id } = useParams();
  const [event,setEvent] = useState(null);
  const [error,setError] = useState('');
  const [message,setMessage] = useState('');
  const [busy,setBusy] = useState(false);
  const navigate = useNavigate();
  useEffect(()=>{api(`/events/${id}`).then(d=>setEvent(d.event)).catch(e=>setError(e.message));},[id]);
  async function register() {
    if (!user) { navigate('/login',{state:{from:`/events/${id}`}}); return; }
    setBusy(true); setError(''); setMessage('');
    try { const result=await api(`/events/${id}/register`,{method:'POST'}); setMessage(result.message || 'Pendaftaran berhasil!'); setEvent(old=>({...old,registered_count:(old.registered_count||0)+1})); }
    catch(e){setError(e.message);} finally{setBusy(false);}
  }
  if (!event && !error) return <main className="container page-pad"><div className="state-panel">Memuat detail acara...</div></main>;
  if (error && !event) return <main className="container page-pad"><div className="state-panel error-state">{error}<p><Link to="/">Kembali</Link></p></div></main>;
  const date=new Date(event.start_at);
  return <main className="container detail-page">
    <Link to="/" className="back-link"><ArrowLeft size={16}/> Semua acara</Link>
    <div className="detail-layout"><section className="detail-main"><div className="detail-art"><span className="category-pill">{event.category_name}</span><div className="detail-art-shape"/><span className="detail-art-label">CAMPUSPULSE EVENTS</span></div><span className="eyebrow">{event.category_name || 'CAMPUS EVENT'}</span><h1>{event.title}</h1><p className="detail-description">{event.description}</p><div className="detail-info-grid"><div><CalendarDays/><span><small>Tanggal</small><strong>{date.toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</strong></span></div><div><Clock/><span><small>Waktu</small><strong>{date.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}</strong></span></div><div><MapPin/><span><small>Lokasi</small><strong>{event.location}</strong></span></div><div><Users/><span><small>Peserta</small><strong>{event.registered_count} / {event.capacity}</strong></span></div></div></section>
      <aside className="registration-panel"><span className="eyebrow">SAVE YOUR SPOT</span><h2>Be part of it.</h2><p className="muted">Daftar dan jadikan acara ini bagian dari pengalaman kampusmu.</p><div className="capacity-bar"><span style={{width:`${Math.min(100,(event.registered_count/event.capacity)*100)}%`}}/></div><small className="muted">{Math.max(0,event.capacity-event.registered_count)} tempat tersisa</small>{message && <div className="success-message"><CheckCircle2 size={17}/>{message}</div>}{error && <div className="form-error">{error}</div>}<button className="button button-full" disabled={busy || event.status!=='published' || event.registered_count>=event.capacity} onClick={register}>{busy?'Memproses...':event.registered_count>=event.capacity?'Kuota penuh':'Register for event'}</button><small className="muted panel-footnote">Pendaftaran mengikuti kuota yang tersedia.</small></aside>
    </div>
  </main>;
}

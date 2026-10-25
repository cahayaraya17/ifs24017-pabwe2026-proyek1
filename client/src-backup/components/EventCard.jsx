import { CalendarDays, MapPin, Users, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const palettes = ['event-art-purple','event-art-blue','event-art-pink','event-art-green'];
export default function EventCard({ event, index = 0 }) {
  const date = new Date(event.start_at);
  return <article className="event-card">
    <div className={`event-art ${palettes[index % palettes.length]}`}>
      <span className="art-orb orb-one"/><span className="art-orb orb-two"/>
      <span className="category-pill">{event.category_name || 'Campus event'}</span>
      <div className="art-date"><strong>{Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('id-ID',{day:'2-digit'})}</strong><span>{Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('id-ID',{month:'short'}).toUpperCase()}</span></div>
      <span className="art-symbol"><CalendarDays size={34}/></span>
    </div>
    <div className="event-card-body">
      <div className="event-meta"><span><CalendarDays size={14}/>{Number.isNaN(date.getTime()) ? 'Jadwal menyusul' : date.toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}</span><span><Users size={14}/>{event.registered_count ?? 0} joined</span></div>
      <h3>{event.title}</h3>
      <p className="muted event-description">{event.description || 'Temukan pengalaman baru dan terhubung dengan komunitas kampus.'}</p>
      <div className="event-card-footer"><span className="location"><MapPin size={15}/>{event.location}</span><Link to={`/events/${event.id}`} className="round-link" aria-label={`Lihat ${event.title}`}><ArrowUpRight size={19}/></Link></div>
    </div>
  </article>;
}

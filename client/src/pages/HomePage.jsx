import { useEffect, useState } from 'react';
import { ArrowRight, Search, Sparkles, Users, CalendarDays, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { api } from '../services/api';

const categories = ['Semua','Seminar','Workshop','Kompetisi','Karier','Komunitas','Olahraga','Seni'];

export default function HomePage() {
  const [events,setEvents] = useState([]);
  const [q,setQ] = useState('');
  const [category,setCategory] = useState('Semua');
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    const params = new URLSearchParams();
    if (q.trim()) params.set('q',q.trim());
    if (category !== 'Semua') params.set('category',category);
    api(`/events?${params.toString()}`).then(data => { if(active) setEvents(data.events || []); })
      .catch(err => { if(active) setError(err.message); })
      .finally(() => { if(active) setLoading(false); });
    return () => { active = false; };
  },[q,category]);
  return <main>
    <section className="hero container">
      <div className="hero-copy">
        <div className="eyebrow"><span className="pulse-dot"/> THE HEARTBEAT OF YOUR CAMPUS</div>
        <h1>Your campus.<br/><span className="gradient-text">Your pulse.</span></h1>
        <p className="hero-description">Temukan acara seru, komunitas baru, dan kesempatan yang bikin kehidupan kampusmu lebih bermakna.</p>
        <div className="hero-actions"><a href="#discover" className="button"><Sparkles size={17}/> Explore events <ArrowRight size={17}/></a><Link to="/register" className="button button-ghost">Join the community</Link></div>
        <div className="hero-social-proof"><div className="mini-avatars"><span>A</span><span>B</span><span>C</span></div><span><strong>One campus.</strong> Endless possibilities.</span></div>
      </div>
      <div className="hero-visual">
        <div className="visual-glow"/>
        <Link to="/map" className="floating-label label-top map-cta"><span className="live-indicator"/> Happening on campus <ArrowRight size={14}/></Link>
        <Link to="/map" className="visual-card visual-card-main map-visual-link" aria-label="Buka peta kampus">
          <div className="visual-card-top"><span className="tiny-tag">FEATURED EVENT</span><span className="visual-date">CAMPUS LIFE</span></div>
          <div className="visual-illustration campus-photo-frame"><img className="campus-hero-photo" src="/images/itdel-campus-aerial.png" alt="Pemandangan area kampus Institut Teknologi Del dari udara"/><div className="campus-photo-overlay"/><span className="campus-photo-caption"><span className="live-indicator"/> INSTITUT TEKNOLOGI DEL</span></div>
          <div className="visual-card-copy"><div><span className="muted small">SITOLUAMA · TOBA · SUMATERA UTARA</span><h3>Our campus, our stories.</h3></div><span className="visual-arrow"><ArrowRight size={18}/></span></div>
        </Link>
        <div className="floating-label label-bottom"><span className="floating-icon"><Users size={16}/></span><span><strong>Find your people</strong><small>Communities that inspire</small></span></div>
        <div className="decor decor-one">✳</div><div className="decor decor-two">✦</div>
      </div>
    </section>
    <section className="stats-strip container">
      <div><span className="stat-icon purple"><CalendarDays size={18}/></span><span><strong>Discover</strong><small>Events worth your time</small></span></div>
      <div><span className="stat-icon blue"><Users size={18}/></span><span><strong>Connect</strong><small>Meet your community</small></span></div>
      <div><span className="stat-icon pink"><TrendingUp size={18}/></span><span><strong>Grow</strong><small>Make every moment count</small></span></div>
    </section>
    <section className="discover-section container" id="discover">
      <div className="section-heading"><div><div className="eyebrow">FIND YOUR NEXT EXPERIENCE</div><h2>What's happening <span className="gradient-text">on campus?</span></h2><p className="muted">Satu tempat untuk menemukan hal-hal menarik di kampusmu.</p></div><Link className="button button-small" to="/map">Lihat Peta Kampus <ArrowRight size={15}/></Link><span className="section-count">{events.length} events found</span></div>
      <div className="event-toolbar"><label className="search-box"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari acara, seminar, workshop..."/></label><div className="category-filters">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={`filter-chip ${category===c?'active':''}`}>{c}</button>)}</div></div>
      {loading ? <div className="state-panel">Memuat acara kampus...</div> : error ? <div className="state-panel error-state"><strong>Belum dapat memuat acara.</strong><p>{error}</p><small>Pastikan backend berjalan di port 4000 dan database sudah di-seed.</small></div> : events.length ? <div className="event-grid">{events.map((event,i)=><EventCard key={event.id} event={event} index={i}/>)}</div> : <div className="state-panel"><span className="empty-icon"><CalendarDays size={24}/></span><strong>Belum ada acara yang cocok.</strong><p>Coba kata kunci atau kategori lain.</p></div>}
    </section>
    <section className="bottom-cta container"><div><span className="eyebrow">YOUR CAMPUS JOURNEY STARTS HERE</span><h2>Don't just attend college.<br/><span className="gradient-text">Experience it.</span></h2></div><Link className="button" to="/login">Get started <ArrowRight size={17}/></Link></section>
    <footer className="footer container"><Link to="/" className="brand footer-brand"><span className="brand-mark"><Sparkles size={18}/></span><span>Campus<span className="brand-accent">Pulse</span></span></Link><span>Made for campus life · CampusPulse MVP</span></footer>
  </main>;
}

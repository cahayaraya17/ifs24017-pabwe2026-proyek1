import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import EventList from '../components/home/EventList';
import EventToolbar from '../components/home/EventToolbar';
import { BottomCta, Footer } from '../components/home/HomeFooter';
import HeroSection from '../components/home/HeroSection';
import StatsStrip from '../components/home/StatsStrip';
import { useEvents } from '../hooks/useEvents';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');
  const { events, loading, error } = useEvents({ q: query, category });

  return (
    <main>
      <HeroSection />
      <StatsStrip />
      <section className="discover-section container" id="discover">
        <div className="section-heading">
          <div>
            <div className="eyebrow">FIND YOUR NEXT EXPERIENCE</div>
            <h2>
              What's happening <span className="gradient-text">on campus?</span>
            </h2>
            <p className="muted">Satu tempat untuk menemukan hal-hal menarik di kampusmu.</p>
          </div>
          <Link className="button button-small" to="/map">
            Lihat Peta Kampus <ArrowRight size={15} />
          </Link>
          <span className="section-count">{events.length} events found</span>
        </div>
        <EventToolbar
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={setCategory}
        />
        <EventList events={events} loading={loading} error={error} />
      </section>
      <BottomCta />
      <Footer />
    </main>
  );
}

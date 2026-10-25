import { useState } from 'react';
import BottomCta from '../components/home/BottomCta';
import EventDiscovery from '../components/home/EventDiscovery';
import HeroSection from '../components/home/HeroSection';
import StatsStrip from '../components/home/StatsStrip';
import SiteFooter from '../components/layout/SiteFooter';
import { ALL_CATEGORIES } from '../constants/events';
import { useEventList } from '../hooks/useEventList';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const { events, loading, error } = useEventList({ query, category });

  return (
    <main>
      <HeroSection />
      <StatsStrip />
      <EventDiscovery
        events={events}
        loading={loading}
        error={error}
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
      />
      <BottomCta />
      <SiteFooter />
    </main>
  );
}

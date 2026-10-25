import { useMemo, useState } from 'react';
import { CAMPUS_PLACES } from '../constants';

export function useCampusMap() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Semua');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(
    () =>
      CAMPUS_PLACES.filter(
        (place) =>
          place.name.toLowerCase().includes(query.toLowerCase()) &&
          (filter === 'Semua' || place.kind === filter),
      ),
    [query, filter],
  );

  return { query, setQuery, filter, setFilter, selected, setSelected, filtered };
}

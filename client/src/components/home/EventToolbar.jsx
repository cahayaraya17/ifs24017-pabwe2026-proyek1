import { Search } from 'lucide-react';
import { EVENT_CATEGORIES } from '../../constants';

export default function EventToolbar({ query, onQueryChange, category, onCategoryChange }) {
  return (
    <div className="event-toolbar">
      <label className="search-box">
        <Search size={18} />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Cari acara, seminar, workshop..."
        />
      </label>
      <div className="category-filters">
        {EVENT_CATEGORIES.map((item) => (
          <button
            key={item}
            onClick={() => onCategoryChange(item)}
            className={`filter-chip ${category === item ? 'active' : ''}`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

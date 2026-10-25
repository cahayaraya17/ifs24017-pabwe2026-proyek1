import { api } from './api';

export async function fetchDashboardData() {
  const [stats, events, categories] = await Promise.all([
    api('/dashboard/stats'),
    api('/events?includeDrafts=true&limit=100'),
    api('/categories'),
  ]);
  return {
    stats: stats.stats,
    events: events.events || [],
    categories: categories.categories || [],
  };
}

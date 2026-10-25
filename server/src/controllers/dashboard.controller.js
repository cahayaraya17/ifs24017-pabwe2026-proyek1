import { dashboardService } from '../services/dashboard.service.js';

export function dashboardStats(req, res) {
  res.json({ stats: dashboardService.getStats(req.user) });
}

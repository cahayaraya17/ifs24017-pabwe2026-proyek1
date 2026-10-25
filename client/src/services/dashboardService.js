import { api } from './api';

export function getDashboardStats() {
  return api('/dashboard/stats');
}

export function listCategories() {
  return api('/categories');
}

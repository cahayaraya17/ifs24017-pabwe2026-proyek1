import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api, setToken } from './api';
import { authenticate, fetchCurrentUser, logout } from './authService';
import { fetchDashboardData } from './dashboardService';
import { deleteEvent, getEvent, listEvents, registerForEvent, saveEvent } from './eventService';
import { cancelRegistration, listMyRegistrations } from './registrationService';

vi.mock('./api', () => ({ api: vi.fn(), setToken: vi.fn() }));

describe('service layer', () => {
  beforeEach(() => {
    api.mockResolvedValue({});
  });

  it('authService', async () => {
    api.mockResolvedValueOnce({ token: 't', user: { id: 1 } });
    await expect(authenticate('login', { email: 'a' })).resolves.toEqual({ id: 1 });
    expect(setToken).toHaveBeenCalledWith('t');

    api.mockResolvedValueOnce({ user: { id: 2 } });
    await expect(fetchCurrentUser()).resolves.toEqual({ id: 2 });

    logout();
    expect(setToken).toHaveBeenLastCalledWith(null);
  });

  it('eventService', async () => {
    api.mockResolvedValueOnce({ events: [1] });
    await expect(listEvents({ q: ' ai ', category: 'Seminar' })).resolves.toEqual([1]);
    expect(api).toHaveBeenCalledWith('/events?q=ai&category=Seminar');

    await expect(listEvents()).resolves.toEqual([]);
    expect(api).toHaveBeenLastCalledWith('/events?');

    api.mockResolvedValueOnce({ event: { id: 3 } });
    await expect(getEvent(3)).resolves.toEqual({ id: 3 });

    await registerForEvent(3);
    expect(api).toHaveBeenLastCalledWith('/events/3/register', { method: 'POST' });

    await saveEvent({ a: 1 });
    expect(api).toHaveBeenLastCalledWith('/events', { method: 'POST', body: '{"a":1}' });
    await saveEvent({ a: 1 }, 9);
    expect(api).toHaveBeenLastCalledWith('/events/9', { method: 'PATCH', body: '{"a":1}' });

    await deleteEvent(9);
    expect(api).toHaveBeenLastCalledWith('/events/9', { method: 'DELETE' });
  });

  it('registrationService', async () => {
    api.mockResolvedValueOnce({ registrations: [1] });
    await expect(listMyRegistrations()).resolves.toEqual([1]);
    await expect(listMyRegistrations()).resolves.toEqual([]);
    await cancelRegistration(4);
    expect(api).toHaveBeenLastCalledWith('/registrations/4', { method: 'DELETE' });
  });

  it('dashboardService menggabungkan tiga request', async () => {
    api
      .mockResolvedValueOnce({ stats: { event_count: 1 } })
      .mockResolvedValueOnce({ events: [1] })
      .mockResolvedValueOnce({ categories: [2] });
    await expect(fetchDashboardData()).resolves.toEqual({
      stats: { event_count: 1 },
      events: [1],
      categories: [2],
    });

    api.mockResolvedValue({});
    await expect(fetchDashboardData()).resolves.toMatchObject({ events: [], categories: [] });
  });
});

import { eventService } from '../services/event.service.js';

export function listEvents(req, res) {
  res.json(eventService.list(req.query, req.user));
}

export function getEvent(req, res) {
  res.json({ event: eventService.get(req.params.id, req.user) });
}

export function createEvent(req, res) {
  const event = eventService.create(req.body, req.user);
  res.status(201).json({ message: 'Acara berhasil dibuat.', event });
}

export function updateEvent(req, res) {
  const event = eventService.update(req.params.id, req.body, req.user);
  res.json({ message: 'Acara berhasil diperbarui.', event });
}

export function deleteEvent(req, res) {
  const { archived } = eventService.remove(req.params.id, req.user);

  if (archived) {
    return res.json({
      message: 'Acara memiliki peserta aktif sehingga statusnya diubah menjadi cancelled.',
    });
  }
  return res.status(204).end();
}

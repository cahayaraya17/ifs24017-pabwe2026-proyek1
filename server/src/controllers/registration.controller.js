import { registrationService } from '../services/registration.service.js';

export function registerForEvent(req, res) {
  res.status(201).json(registrationService.registerForEvent(req.params.id, req.user));
}

export function myRegistrations(req, res) {
  res.json({ registrations: registrationService.listForUser(req.user.id) });
}

export function cancelRegistration(req, res) {
  res.json(registrationService.cancel(req.params.id, req.user));
}

export function eventRegistrations(req, res) {
  res.json({ registrations: registrationService.listForEvent(req.params.id, req.user) });
}

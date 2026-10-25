import { authService } from '../services/auth.service.js';

export function register(req, res) {
  res.status(201).json(authService.register(req.body));
}

export function login(req, res) {
  res.json(authService.login(req.body));
}

export function me(req, res) {
  res.json({ user: authService.getProfile(req.user.id) });
}

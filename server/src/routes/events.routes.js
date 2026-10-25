import { Router } from 'express';
import {
  createEvent,
  deleteEvent,
  getEvent,
  listEvents,
  updateEvent,
} from '../controllers/event.controller.js';
import { eventRegistrations, registerForEvent } from '../controllers/registration.controller.js';
import { MANAGER_ROLES, ROLES } from '../constants/roles.js';
import { allowRoles, optionalAuth, requireAuth } from '../middleware/auth.js';

const router = Router();
const managersOnly = [requireAuth, allowRoles(...MANAGER_ROLES)];

// Publik: pengunjung melihat acara terbit, pengelola yang login juga bisa melihat draft miliknya.
router.get('/', optionalAuth, listEvents);
router.get('/:id', optionalAuth, getEvent);

router.post('/', ...managersOnly, createEvent);
router.patch('/:id', ...managersOnly, updateEvent);
router.delete('/:id', ...managersOnly, deleteEvent);

router.post('/:id/register', requireAuth, allowRoles(ROLES.STUDENT), registerForEvent);
router.get('/:id/registrations', ...managersOnly, eventRegistrations);

export default router;

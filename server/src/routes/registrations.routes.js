import { Router } from 'express';
import { requireAuth, allowRoles } from '../middleware/auth.js';
import { myRegistrations, cancelRegistration } from '../controllers/registrations.controller.js';
const router = Router();
router.get('/me', requireAuth, allowRoles('student'), myRegistrations);
router.delete('/:id', requireAuth, cancelRegistration);
export default router;

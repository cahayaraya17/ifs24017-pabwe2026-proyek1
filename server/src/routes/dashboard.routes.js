import { Router } from 'express';
import { requireAuth, allowRoles } from '../middleware/auth.js';
import { dashboardStats } from '../controllers/registrations.controller.js';
const router = Router();
router.get('/stats', requireAuth, allowRoles('admin','organizer'), dashboardStats);
export default router;

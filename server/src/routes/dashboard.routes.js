import { Router } from 'express';
import { dashboardStats } from '../controllers/dashboard.controller.js';
import { MANAGER_ROLES } from '../constants/roles.js';
import { allowRoles, requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/stats', requireAuth, allowRoles(...MANAGER_ROLES), dashboardStats);

export default router;

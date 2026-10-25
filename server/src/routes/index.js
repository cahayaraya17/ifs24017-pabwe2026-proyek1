import { Router } from 'express';
import authRoutes from './auth.routes.js';
import categoryRoutes from './categories.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import eventRoutes from './events.routes.js';
import registrationRoutes from './registrations.routes.js';

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok', service: 'CampusPulse API' }));
router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/categories', categoryRoutes);
router.use('/registrations', registrationRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;

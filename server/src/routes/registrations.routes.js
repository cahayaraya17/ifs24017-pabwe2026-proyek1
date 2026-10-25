import { Router } from 'express';
import { ROLES } from '../constants/roles.js';
import { cancelRegistration, myRegistrations } from '../controllers/registration.controller.js';
import { allowRoles, requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/me', requireAuth, allowRoles(ROLES.STUDENT), myRegistrations);
router.delete('/:id', requireAuth, cancelRegistration);

export default router;

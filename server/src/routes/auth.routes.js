import { Router } from 'express';
import { config } from '../config/env.js';
import { login, me, register } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { createRateLimiter } from '../middleware/rateLimit.js';

const router = Router();
const authLimiter = createRateLimiter(config.authRateLimit);

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', requireAuth, me);

export default router;

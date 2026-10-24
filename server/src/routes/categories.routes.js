import { Router } from 'express';
import { db } from '../config/database.js';
const router = Router();
router.get('/', (req,res)=>res.json({categories:db.prepare('SELECT * FROM categories ORDER BY name').all()}));
export default router;

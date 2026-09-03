import { Router } from 'express';
import { getHealth, getDatabaseHealth } from '../controllers/health.controller';

const router = Router();

// GET /api/health
router.get('/', getHealth);

// GET /api/health/database
router.get('/database', getDatabaseHealth);

export default router;

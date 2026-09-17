import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getStatsController } from '../controllers/dashboard.controller';

const router = Router();

router.use(authenticate);

router.get('/stats', getStatsController);

export default router;

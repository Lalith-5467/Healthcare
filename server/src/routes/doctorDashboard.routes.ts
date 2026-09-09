import { Router } from 'express';
import { getDashboardData } from '../controllers/doctorDashboard.controller';

const router = Router();

router.get('/', getDashboardData);

export default router;

import { Router } from 'express';
import { getTodaySchedule } from '../controllers/appointment.controller';

const router = Router();

// Route to get today's appointments for the doctor dashboard
router.get('/schedule', getTodaySchedule);

export default router;

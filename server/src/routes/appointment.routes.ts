import { Router } from 'express';
import { getTodaySchedule, createAppointment } from '../controllers/appointment.controller';

const router = Router();

// Route to get today's appointments for the doctor dashboard
router.get('/schedule', getTodaySchedule);

// Route to create a new appointment from the patient portal
router.post('/', createAppointment);

export default router;

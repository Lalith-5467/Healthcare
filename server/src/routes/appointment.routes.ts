import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getAppointmentsController,
  getAppointmentByIdController,
  createAppointmentController,
  updateAppointmentController,
  cancelAppointmentController,
} from '../controllers/appointment.controller';

const router = Router();

router.use(authenticate);

router.get('/', getAppointmentsController);
router.get('/:id', getAppointmentByIdController);
router.post('/', createAppointmentController);
router.patch('/:id', updateAppointmentController);
router.patch('/:id/cancel', cancelAppointmentController);
router.post('/:id/cancel', cancelAppointmentController);
router.delete('/:id', cancelAppointmentController);

export default router;

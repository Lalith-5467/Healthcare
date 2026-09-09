import { Router } from 'express';
import { 
  getConsultationByAppointment, 
  startConsultation, 
  updateConsultation, 
  completeConsultation 
} from '../controllers/consultation.controller';

const router = Router();

// GET consultation (by appointment ID)
router.get('/:id', getConsultationByAppointment);

// POST start consultation (by appointment ID)
router.post('/:id/start', startConsultation);

// PUT update consultation draft (by consultation ID)
router.put('/:id', updateConsultation);

// POST complete consultation (by consultation ID)
router.post('/:id/complete', completeConsultation);

export default router;

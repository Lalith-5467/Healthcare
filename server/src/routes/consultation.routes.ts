import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import {
  getConsultationByAppointment,
  startConsultation,
  updateConsultation,
  completeConsultation,
} from '../controllers/consultation.controller';

const router = Router();

// All consultation routes require a valid JWT
// Security fix (HMS Phase 0): authenticate middleware was missing — added 2026-10-28
router.use(authenticate);

// GET consultation by appointment ID
// Patients can read their own consultation; doctors/nurses/admin can read assigned ones
router.get(
  '/:id',
  requireRole('DOCTOR', 'NURSE', 'PATIENT', 'ADMIN', 'SUPER_ADMIN'),
  getConsultationByAppointment
);

// POST start consultation — Doctor only initiates a consultation session
router.post(
  '/:id/start',
  requireRole('DOCTOR', 'ADMIN', 'SUPER_ADMIN'),
  startConsultation
);

// PUT update consultation draft — Doctor records clinical notes
router.put(
  '/:id',
  requireRole('DOCTOR', 'ADMIN', 'SUPER_ADMIN'),
  updateConsultation
);

// POST complete consultation — Doctor finalizes and closes the session
router.post(
  '/:id/complete',
  requireRole('DOCTOR', 'ADMIN', 'SUPER_ADMIN'),
  completeConsultation
);

export default router;

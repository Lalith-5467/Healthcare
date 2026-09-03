import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import {
  createPrescriptionController,
  getPrescriptionsController,
  getPrescriptionByIdController,
  reviewPrescriptionController,
  confirmPrescriptionController,
  updatePrescriptionController,
  addPrescriptionItemController,
  deletePrescriptionItemController,
  cancelPrescriptionController,
} from '../controllers/prescription.controller';

const router = Router();

// All prescription routes require authentication
router.use(authenticate);

// 1. Create prescription with nested items (Patient, Doctor, Admin, Super Admin)
router.post(
  '/',
  requireRole('PATIENT', 'DOCTOR', 'ADMIN', 'SUPER_ADMIN'),
  createPrescriptionController
);

// 2. List prescriptions with pagination, filters, and patient isolation
router.get(
  '/',
  requireRole(
    'PATIENT',
    'DOCTOR',
    'NURSE',
    'PHARMACIST',
    'ADMIN',
    'SUPER_ADMIN'
  ),
  getPrescriptionsController
);

// 3. Get single prescription by ID with patient ownership check
router.get(
  '/:id',
  requireRole(
    'PATIENT',
    'DOCTOR',
    'NURSE',
    'PHARMACIST',
    'ADMIN',
    'SUPER_ADMIN'
  ),
  getPrescriptionByIdController
);

// 4. Patient review prescription: PENDING_REVIEW -> REVIEWED
router.patch(
  '/:id/review',
  requireRole('PATIENT', 'ADMIN', 'SUPER_ADMIN'),
  reviewPrescriptionController
);

// 5. Patient confirm prescription: REVIEWED -> CONFIRMED
router.patch(
  '/:id/confirm',
  requireRole('PATIENT', 'ADMIN', 'SUPER_ADMIN'),
  confirmPrescriptionController
);

// 6. Doctor update clinical prescription information
router.put(
  '/:id',
  requireRole('DOCTOR', 'ADMIN', 'SUPER_ADMIN'),
  updatePrescriptionController
);

// 7. Add item to prescription
router.post(
  '/:id/items',
  requireRole('DOCTOR', 'ADMIN', 'SUPER_ADMIN'),
  addPrescriptionItemController
);

// 8. Remove item from prescription
router.delete(
  '/:id/items/:itemId',
  requireRole('DOCTOR', 'ADMIN', 'SUPER_ADMIN'),
  deletePrescriptionItemController
);

// 9. Cancel prescription
router.patch(
  '/:id/cancel',
  requireRole('DOCTOR', 'ADMIN', 'SUPER_ADMIN'),
  cancelPrescriptionController
);

export default router;

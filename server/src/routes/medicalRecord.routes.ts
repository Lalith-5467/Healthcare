import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import {
  createRecordController,
  getRecordsController,
  getRecordByIdController,
  updateRecordController,
  deleteRecordController,
} from '../controllers/medicalRecord.controller';

const router = Router();

// All medical record routes require authentication
router.use(authenticate);

// 1. Create a medical record (Doctors, Nurses, Admins, Super Admins)
router.post(
  '/',
  requireRole('DOCTOR', 'NURSE', 'ADMIN', 'SUPER_ADMIN'),
  createRecordController
);

// 2. List medical records with pagination, filters, and patient isolation
router.get(
  '/',
  requireRole('PATIENT', 'DOCTOR', 'NURSE', 'ADMIN', 'SUPER_ADMIN'),
  getRecordsController
);

// 3. Get single medical record by ID (with ownership check)
router.get(
  '/:id',
  requireRole('PATIENT', 'DOCTOR', 'NURSE', 'ADMIN', 'SUPER_ADMIN'),
  getRecordByIdController
);

// 4. Update clinical medical record (Doctors, Nurses, Admins, Super Admins)
router.put(
  '/:id',
  requireRole('DOCTOR', 'NURSE', 'ADMIN', 'SUPER_ADMIN'),
  updateRecordController
);

// 5. Delete medical record (Admins, Super Admins only)
router.delete(
  '/:id',
  requireRole('ADMIN', 'SUPER_ADMIN'),
  deleteRecordController
);

export default router;

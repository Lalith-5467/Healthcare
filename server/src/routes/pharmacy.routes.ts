import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import {
  createPharmacyController,
  getPharmaciesController,
  getAvailablePharmaciesController,
  getPharmacyByIdController,
  updatePharmacyController,
  verifyPharmacyController,
  updatePharmacyStatusController,
} from '../controllers/pharmacy.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// 1. Patient & Healthcare staff: Retrieve verified, active tie-up pharmacies
router.get(
  '/available',
  requireRole('PATIENT', 'DOCTOR', 'ADMIN', 'SUPER_ADMIN'),
  getAvailablePharmaciesController
);

// 2. Admin: Register a new pharmacy
router.post(
  '/',
  requireRole('ADMIN', 'SUPER_ADMIN'),
  createPharmacyController
);

// 3. Admin: List all pharmacies
router.get(
  '/',
  requireRole('ADMIN', 'SUPER_ADMIN'),
  getPharmaciesController
);

// 4. Admin: Get single pharmacy details
router.get(
  '/:id',
  requireRole('ADMIN', 'SUPER_ADMIN'),
  getPharmacyByIdController
);

// 5. Admin: Update pharmacy details
router.put(
  '/:id',
  requireRole('ADMIN', 'SUPER_ADMIN'),
  updatePharmacyController
);

// 6. Admin: Verify or unverify pharmacy
router.patch(
  '/:id/verify',
  requireRole('ADMIN', 'SUPER_ADMIN'),
  verifyPharmacyController
);

// 7. Admin: Update pharmacy active/tie-up status
router.patch(
  '/:id/status',
  requireRole('ADMIN', 'SUPER_ADMIN'),
  updatePharmacyStatusController
);

export default router;

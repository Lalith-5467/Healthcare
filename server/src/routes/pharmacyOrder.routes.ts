import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import {
  createPharmacyOrderController,
  getPharmacyOrdersController,
  getPharmacyOrderByIdController,
  acceptPharmacyOrderController,
  declinePharmacyOrderController,
  updatePharmacyOrderStatusController,
} from '../controllers/pharmacyOrder.controller';

const router = Router();

// All pharmacy order routes require authentication
router.use(authenticate);

// 1. Create a pharmacy order from confirmed prescription (Patient, Admin, Super Admin)
router.post(
  '/',
  requireRole('PATIENT', 'ADMIN', 'SUPER_ADMIN'),
  createPharmacyOrderController
);

// 2. List pharmacy orders (Patient sees own orders; Pharmacist sees their pharmacy orders; Admin sees all)
router.get(
  '/',
  requireRole('PATIENT', 'PHARMACIST', 'ADMIN', 'SUPER_ADMIN'),
  getPharmacyOrdersController
);

// 3. Get single pharmacy order by ID
router.get(
  '/:id',
  requireRole('PATIENT', 'PHARMACIST', 'ADMIN', 'SUPER_ADMIN'),
  getPharmacyOrderByIdController
);

// 4. Pharmacist accepts order: PENDING -> ACCEPTED
router.patch(
  '/:id/accept',
  requireRole('PHARMACIST', 'ADMIN', 'SUPER_ADMIN'),
  acceptPharmacyOrderController
);

// 5. Pharmacist declines order: PENDING -> DECLINED
router.patch(
  '/:id/decline',
  requireRole('PHARMACIST', 'ADMIN', 'SUPER_ADMIN'),
  declinePharmacyOrderController
);

// 6. Pharmacist updates order status along valid state machine transitions
router.patch(
  '/:id/status',
  requireRole('PHARMACIST', 'ADMIN', 'SUPER_ADMIN'),
  updatePharmacyOrderStatusController
);

export default router;

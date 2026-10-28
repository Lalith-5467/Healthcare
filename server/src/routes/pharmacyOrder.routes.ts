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
  getPharmacyOrderBillController,
  processPharmacyOrderPaymentController,
  confirmCashPaymentController,
} from '../controllers/pharmacyOrder.controller';

const router = Router();

// All pharmacy order routes require authentication
router.use(authenticate);

// 1. Create a pharmacy order from confirmed prescription or refill request (Patient, Caregiver, Doctor, Nurse, Admin, Super Admin)
router.post(
  '/',
  requireRole('PATIENT', 'CAREGIVER', 'DOCTOR', 'NURSE', 'ADMIN', 'SUPER_ADMIN'),
  createPharmacyOrderController
);

// 2. List pharmacy orders (Patient sees own orders; Pharmacist sees their pharmacy orders; Doctor/Nurse/Caregiver/Admin see relevant orders)
router.get(
  '/',
  requireRole('PATIENT', 'PHARMACIST', 'DOCTOR', 'NURSE', 'CAREGIVER', 'ADMIN', 'SUPER_ADMIN'),
  getPharmacyOrdersController
);

// 3. Get single pharmacy order by ID
router.get(
  '/:id',
  requireRole('PATIENT', 'PHARMACIST', 'DOCTOR', 'NURSE', 'CAREGIVER', 'ADMIN', 'SUPER_ADMIN'),
  getPharmacyOrderByIdController
);

// 4. Get itemised bill with real database prices and calculation
router.get(
  '/:id/bill',
  requireRole('PATIENT', 'PHARMACIST', 'DOCTOR', 'NURSE', 'CAREGIVER', 'ADMIN', 'SUPER_ADMIN'),
  getPharmacyOrderBillController
);

// 5. Patient or Caregiver makes payment with strict backend recalculation
router.post(
  '/:id/pay',
  requireRole('PATIENT', 'CAREGIVER', 'ADMIN', 'SUPER_ADMIN'),
  processPharmacyOrderPaymentController
);

// 6. Pharmacist confirms cash payment received at counter
router.post(
  '/:id/confirm-cash',
  requireRole('PHARMACIST', 'ADMIN', 'SUPER_ADMIN'),
  confirmCashPaymentController
);

// 7. Pharmacist accepts order: PENDING -> ACCEPTED
router.patch(
  '/:id/accept',
  requireRole('PHARMACIST', 'ADMIN', 'SUPER_ADMIN'),
  acceptPharmacyOrderController
);

// 8. Pharmacist declines order: PENDING -> DECLINED
router.patch(
  '/:id/decline',
  requireRole('PHARMACIST', 'ADMIN', 'SUPER_ADMIN'),
  declinePharmacyOrderController
);

// 9. Pharmacist updates order status along valid state machine transitions (enforces dispensing payment rule)
router.patch(
  '/:id/status',
  requireRole('PHARMACIST', 'ADMIN', 'SUPER_ADMIN'),
  updatePharmacyOrderStatusController
);

export default router;

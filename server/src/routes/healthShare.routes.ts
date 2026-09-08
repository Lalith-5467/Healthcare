import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import {
  generateQRTokenController,
  validateQRTokenController,
  createAccessRequestController,
  getPatientAccessRequestsController,
  getDoctorAccessRequestsController,
  approveAccessRequestController,
  rejectAccessRequestController,
  revokeAccessController,
  getPatient360DataController,
} from '../controllers/healthShare.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// 1. Patient / User: Generate Temporary Secure QR Token
router.post('/generate-qr', requireRole('PATIENT', 'DOCTOR', 'ADMIN', 'SUPER_ADMIN', 'CAREGIVER'), generateQRTokenController);

// 2. Doctor: Validate Scanned QR Token (Basic ID only)
router.post('/validate-qr', requireRole('DOCTOR', 'PATIENT', 'ADMIN', 'SUPER_ADMIN', 'NURSE'), validateQRTokenController);

// 3. Doctor: Create Access Request (Status = PENDING)
router.post('/access-requests', requireRole('DOCTOR', 'PATIENT', 'ADMIN', 'SUPER_ADMIN', 'NURSE'), createAccessRequestController);

// 4. Patient: List My Access Requests
router.get('/access-requests/patient', requireRole('PATIENT', 'DOCTOR', 'ADMIN', 'SUPER_ADMIN', 'CAREGIVER'), getPatientAccessRequestsController);

// 5. Doctor: List My Access Requests
router.get('/access-requests/doctor', requireRole('DOCTOR', 'PATIENT', 'ADMIN', 'SUPER_ADMIN'), getDoctorAccessRequestsController);

// 6. Patient: Approve Access Request
router.post('/access-requests/:id/approve', requireRole('PATIENT', 'DOCTOR', 'ADMIN', 'SUPER_ADMIN', 'CAREGIVER'), approveAccessRequestController);

// 7. Patient: Reject Access Request
router.post('/access-requests/:id/reject', requireRole('PATIENT', 'DOCTOR', 'ADMIN', 'SUPER_ADMIN', 'CAREGIVER'), rejectAccessRequestController);

// 8. Patient: Revoke Active Access Session
router.post('/access-sessions/:id/revoke', requireRole('PATIENT', 'DOCTOR', 'ADMIN', 'SUPER_ADMIN', 'CAREGIVER'), revokeAccessController);

// 9. Doctor: Get Patient 360° Data (Strict Session & Scope Validation)
router.get('/patient-360/:patientId', requireRole('DOCTOR', 'ADMIN', 'SUPER_ADMIN', 'NURSE'), getPatient360DataController);

export default router;

import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import {
  getCurrentUserProfile,
  getPatientProfile,
  updatePatientProfile,
  getDoctorProfile,
  updateDoctorProfile,
  getNurseProfile,
  updateNurseProfile,
  getPharmacistProfile,
  updatePharmacistProfile,
  getCaregiverProfile,
  updateCaregiverProfile,
  getInsuranceProfile,
  updateInsuranceProfile,
} from '../controllers/profile.controller';

const router = Router();

// All profile routes require authentication
router.use(authenticate);

// 1. Current user generic profile
router.get('/', getCurrentUserProfile);

// 2. Patient Profile
router.get('/patient', requireRole('PATIENT', 'ADMIN', 'SUPER_ADMIN'), getPatientProfile);
router.put('/patient', requireRole('PATIENT', 'ADMIN', 'SUPER_ADMIN'), updatePatientProfile);

// 3. Doctor Profile
router.get('/doctor', requireRole('DOCTOR', 'ADMIN', 'SUPER_ADMIN'), getDoctorProfile);
router.put('/doctor', requireRole('DOCTOR', 'ADMIN', 'SUPER_ADMIN'), updateDoctorProfile);

// 4. Nurse Profile
router.get('/nurse', requireRole('NURSE', 'ADMIN', 'SUPER_ADMIN'), getNurseProfile);
router.put('/nurse', requireRole('NURSE', 'ADMIN', 'SUPER_ADMIN'), updateNurseProfile);

// 5. Pharmacist Profile
router.get('/pharmacist', requireRole('PHARMACIST', 'ADMIN', 'SUPER_ADMIN'), getPharmacistProfile);
router.put('/pharmacist', requireRole('PHARMACIST', 'ADMIN', 'SUPER_ADMIN'), updatePharmacistProfile);

// 6. Caregiver Profile
router.get('/caregiver', requireRole('CAREGIVER', 'ADMIN', 'SUPER_ADMIN'), getCaregiverProfile);
router.put('/caregiver', requireRole('CAREGIVER', 'ADMIN', 'SUPER_ADMIN'), updateCaregiverProfile);

// 7. Insurance Provider Profile
router.get(
  '/insurance',
  requireRole('INSURANCE_PROVIDER', 'INSURANCE', 'ADMIN', 'SUPER_ADMIN'),
  getInsuranceProfile
);
router.put(
  '/insurance',
  requireRole('INSURANCE_PROVIDER', 'INSURANCE', 'ADMIN', 'SUPER_ADMIN'),
  updateInsuranceProfile
);

export default router;

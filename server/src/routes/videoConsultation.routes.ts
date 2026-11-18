import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import {
  requestVideoConsultation,
  getDoctorRequests,
  getPatientRequests,
  acceptVideoConsultation,
  declineVideoConsultation,
  cancelVideoConsultation,
  joinVideoConsultation,
  endVideoConsultation,
  getConsultationById,
  getIceServers,
  getAvailableDoctors,
  getLiveKitToken,
} from '../controllers/videoConsultation.controller';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// 0. LiveKit room token endpoint
router.post('/:id/livekit-token', getLiveKitToken);

// 0. Secure ephemeral ICE/TURN servers endpoint
router.get('/ice-servers', getIceServers);

// 0.1 Retrieve list of actual doctors for consultation
router.get('/doctors', getAvailableDoctors);

// 1. Patient creates consultation request
router.post('/request', requireRole('PATIENT'), requestVideoConsultation);

// 2. Doctor retrieves incoming consultation requests
router.get('/doctor/requests', requireRole('DOCTOR'), getDoctorRequests);

// 3. Patient retrieves their consultation requests
router.get('/patient/requests', requireRole('PATIENT'), getPatientRequests);

// 4. Doctor accepts consultation request
router.patch('/:id/accept', requireRole('DOCTOR'), acceptVideoConsultation);

// 5. Doctor declines consultation request
router.patch('/:id/decline', requireRole('DOCTOR'), declineVideoConsultation);

// 6. Patient cancels consultation request
router.patch('/:id/cancel', requireRole('PATIENT'), cancelVideoConsultation);

// 7. Participant joins room
router.patch('/:id/join', joinVideoConsultation);

// 8. Participant ends consultation
router.patch('/:id/end', endVideoConsultation);

// 9. Get specific consultation details
router.get('/:id', getConsultationById);

export default router;

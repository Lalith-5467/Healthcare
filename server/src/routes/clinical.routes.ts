import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getDoctorPatientsController,
  getNurseCareRequestsController,
  getPatientCareRequestsController,
  createNurseCareRequestController,
  updateCareRequestController,
} from '../controllers/clinical.controller';

const router = Router();

router.use(authenticate);

router.get('/doctor-patients', getDoctorPatientsController);
router.get('/nurse-care-requests', getNurseCareRequestsController);
router.get('/my-care-requests', getPatientCareRequestsController);
router.post('/nurse-care-requests', createNurseCareRequestController);
router.patch('/nurse-care-requests/:id', updateCareRequestController);

export default router;


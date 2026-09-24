import { Router } from 'express';
import {
  getWardsController,
  getTasksController,
  createTaskController,
  updateTaskController,
  logVitalController,
  getCareCircleController,
  addCareCircleMemberController,
  removeCareCircleMemberController,
  toggleConsentStatusController,
  addDependentController,
  removeDependentController,
} from '../controllers/caregiver.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/wards', getWardsController);
router.post('/dependents', addDependentController);
router.delete('/dependents/:patientId', removeDependentController);
router.get('/tasks', getTasksController);
router.post('/tasks', createTaskController);
router.patch('/tasks/:id', updateTaskController);
router.post('/vitals', logVitalController);

router.get('/care-circle', getCareCircleController);
router.post('/care-circle/members', addCareCircleMemberController);
router.delete('/care-circle/members/:targetCaregiverId', removeCareCircleMemberController);
router.patch('/consent/status', toggleConsentStatusController);

export default router;


import { Router } from 'express';
import {
  getWardsController,
  getTasksController,
  createTaskController,
  updateTaskController,
  logVitalController,
} from '../controllers/caregiver.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/wards', getWardsController);
router.get('/tasks', getTasksController);
router.post('/tasks', createTaskController);
router.patch('/tasks/:id', updateTaskController);
router.post('/vitals', logVitalController);

export default router;

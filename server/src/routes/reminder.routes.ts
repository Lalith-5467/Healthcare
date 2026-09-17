import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getRemindersController,
  createReminderController,
  updateReminderController,
  updateFollowUpStatusController,
  deleteReminderController,
} from '../controllers/reminder.controller';

const router = Router();

router.use(authenticate);

router.get('/', getRemindersController);
router.post('/', createReminderController);
router.patch('/:id/follow-up', updateFollowUpStatusController);
router.patch('/:id', updateReminderController);
router.delete('/:id', deleteReminderController);

export default router;

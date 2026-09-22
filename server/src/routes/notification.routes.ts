import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getNotificationsController,
  markNotificationReadController,
  markAllNotificationsReadController,
  deleteNotificationController,
  generateSpeechController,
} from '../controllers/notification.controller';

const router = Router();

router.use(authenticate);

router.get('/', getNotificationsController);
router.post('/speech', generateSpeechController);
router.patch('/read-all', markAllNotificationsReadController);
router.patch('/:id/read', markNotificationReadController);
router.delete('/:id', deleteNotificationController);

export default router;

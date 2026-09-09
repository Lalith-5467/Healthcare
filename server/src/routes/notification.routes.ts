import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getNotificationsController,
  markNotificationReadController,
  markAllNotificationsReadController,
  deleteNotificationController,
} from '../controllers/notification.controller';

const router = Router();

router.use(authenticate);

router.get('/', getNotificationsController);
router.patch('/read-all', markAllNotificationsReadController);
router.patch('/:id/read', markNotificationReadController);
router.delete('/:id', deleteNotificationController);

export default router;

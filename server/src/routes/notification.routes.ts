import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getNotificationsController,
  markNotificationReadController,
  markAllNotificationsReadController,
} from '../controllers/notification.controller';

const router = Router();

router.use(authenticate);

router.get('/', getNotificationsController);
router.patch('/read-all', markAllNotificationsReadController);
router.patch('/:id/read', markNotificationReadController);

export default router;

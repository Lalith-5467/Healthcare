import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';

export const getNotificationsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await NotificationService.getNotifications(req.user!.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const markNotificationReadController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await NotificationService.markAsRead(id, req.user!.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsReadController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await NotificationService.markAllAsRead(req.user!.id);
    res.status(200).json({ success: true, message: 'All notifications marked as read', data });
  } catch (error) {
    next(error);
  }
};

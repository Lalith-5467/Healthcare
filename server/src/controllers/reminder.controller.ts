import { Request, Response, NextFunction } from 'express';
import { ReminderService } from '../services/reminder.service';

export const getRemindersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const patientId = typeof req.query.patientId === 'string' ? req.query.patientId : undefined;
    const data = await ReminderService.getReminders(req.user!.id, req.user!.role, patientId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createReminderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await ReminderService.createReminder(req.user!.id, req.user!.role, req.body);
    res.status(201).json({ success: true, message: 'Reminder created', data });
  } catch (error) {
    next(error);
  }
};

export const updateReminderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await ReminderService.updateReminder(id, req.body);
    res.status(200).json({ success: true, message: 'Reminder updated', data });
  } catch (error) {
    next(error);
  }
};

export const updateFollowUpStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { followUpStatus } = req.body;
    const data = await ReminderService.updateFollowUpStatus(id, followUpStatus);
    res.status(200).json({ success: true, message: 'Follow-up status updated', data });
  } catch (error) {
    next(error);
  }
};

export const deleteReminderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await ReminderService.deleteReminder(id);
    res.status(200).json({ success: true, message: 'Reminder deleted', data });
  } catch (error) {
    next(error);
  }
};

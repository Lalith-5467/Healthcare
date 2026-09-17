import { Request, Response, NextFunction } from 'express';
import { CaregiverService } from '../services/caregiver.service';

export const getWardsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await CaregiverService.getWards(req.user!.id, req.user!.role);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getTasksController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const patientId = req.query.patientId as string;
    const data = await CaregiverService.getTasks(req.user!.id, req.user!.role, patientId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await CaregiverService.createTask(req.user!.id, req.user!.role, req.body);
    res.status(201).json({ success: true, message: 'Caregiver task scheduled', data });
  } catch (error) {
    next(error);
  }
};

export const updateTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await CaregiverService.updateTask(id, req.body);
    res.status(200).json({ success: true, message: 'Caregiver task updated', data });
  } catch (error) {
    next(error);
  }
};

export const logVitalController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await CaregiverService.logVital(req.user!.id, req.body);
    res.status(201).json({ success: true, message: 'Vital record logged successfully', data });
  } catch (error) {
    next(error);
  }
};

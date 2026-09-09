import { Request, Response, NextFunction } from 'express';
import { VitalService } from '../services/vital.service';

export const getVitalsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const patientId = typeof req.query.patientId === 'string' ? req.query.patientId : undefined;
    const data = await VitalService.getVitals(req.user!.id, req.user!.role, patientId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createVitalController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await VitalService.createVital(req.user!.id, req.user!.role, req.body);
    res.status(201).json({ success: true, message: 'Vital recorded successfully', data });
  } catch (error) {
    next(error);
  }
};

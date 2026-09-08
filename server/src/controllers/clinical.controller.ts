import { Request, Response, NextFunction } from 'express';
import { ClinicalService } from '../services/clinical.service';

export const getDoctorPatientsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await ClinicalService.getDoctorPatients(req.user!.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getNurseCareRequestsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await ClinicalService.getNurseCareRequests(req.user!.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createNurseCareRequestController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await ClinicalService.createNurseCareRequest(req.user!.id, req.body);
    res.status(201).json({ success: true, message: 'Care request created', data });
  } catch (error) {
    next(error);
  }
};

export const getPatientCareRequestsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await ClinicalService.getPatientCareRequests(req.user!.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateCareRequestController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await ClinicalService.updateCareRequest(id, req.body, req.user?.id);
    res.status(200).json({ success: true, message: 'Care request updated', data });
  } catch (error) {
    next(error);
  }
};


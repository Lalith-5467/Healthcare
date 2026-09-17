import { Request, Response, NextFunction } from 'express';
import { MedicineService } from '../services/medicine.service';

export const getMedicinesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const data = await MedicineService.getMedicines(search, category);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getActiveMedicationsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const patientId = typeof req.query.patientId === 'string' ? req.query.patientId : undefined;
    const data = await MedicineService.getActiveMedications(req.user!.id, req.user!.role, patientId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createPatientMedicationController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await MedicineService.createPatientMedication(req.user!.id, req.user!.role, req.body);
    res.status(201).json({ success: true, message: 'Medication scheduled successfully', data });
  } catch (error) {
    next(error);
  }
};

export const recordDoseLogController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await MedicineService.recordDoseLog(req.user!.id, req.user!.role, req.body);
    res.status(200).json({ success: true, message: 'Dose recorded successfully', data });
  } catch (error) {
    next(error);
  }
};

export const updatePatientMedicationController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await MedicineService.updatePatientMedication(id, req.body);
    res.status(200).json({ success: true, message: 'Medication updated', data });
  } catch (error) {
    next(error);
  }
};

export const deletePatientMedicationController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await MedicineService.deletePatientMedication(id);
    res.status(200).json({ success: true, message: 'Medication removed' });
  } catch (error) {
    next(error);
  }
};

export const createMedicineController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await MedicineService.createMedicine(req.body);
    res.status(201).json({ success: true, message: 'Medicine added to catalog', data });
  } catch (error) {
    next(error);
  }
};

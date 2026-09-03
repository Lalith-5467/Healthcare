import { Request, Response, NextFunction } from 'express';
import { MedicalRecordService } from '../services/medicalRecord.service';
import {
  createMedicalRecordSchema,
  updateMedicalRecordSchema,
} from '../utils/validators';

export const createRecordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validated = createMedicalRecordSchema.parse(req.body);
    const data = await MedicalRecordService.createMedicalRecord(
      validated,
      req.user!,
      req.ip
    );

    res.status(201).json({
      success: true,
      message: 'Medical record created successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecordsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await MedicalRecordService.getMedicalRecords(
      {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        type: typeof req.query.type === 'string' ? req.query.type : undefined,
        patientId: typeof req.query.patientId === 'string' ? req.query.patientId : undefined,
        status: typeof req.query.status === 'string' ? req.query.status : undefined,
        isImportant: typeof req.query.isImportant === 'string' ? req.query.isImportant : undefined,
        search: typeof req.query.search === 'string' ? req.query.search : undefined,
      },
      req.user!
    );

    res.status(200).json({
      success: true,
      data: result.records,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecordByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await MedicalRecordService.getMedicalRecordById(
      id,
      req.user!,
      req.ip
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRecordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const validated = updateMedicalRecordSchema.parse(req.body);
    const data = await MedicalRecordService.updateMedicalRecord(
      id,
      validated,
      req.user!,
      req.ip
    );

    res.status(200).json({
      success: true,
      message: 'Medical record updated successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRecordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await MedicalRecordService.deleteMedicalRecord(
      id,
      req.user!,
      req.ip
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

import { Request, Response, NextFunction } from 'express';
import { PrescriptionService } from '../services/prescription.service';
import {
  createPrescriptionSchema,
  updatePrescriptionSchema,
  prescriptionItemInputSchema,
} from '../utils/validators';

export const createPrescriptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validated = createPrescriptionSchema.parse(req.body);
    const data = await PrescriptionService.createPrescription(
      validated,
      req.user!,
      req.ip
    );

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getPrescriptionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await PrescriptionService.getPrescriptions(
      {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        status: typeof req.query.status === 'string' ? req.query.status : undefined,
        patientId: typeof req.query.patientId === 'string' ? req.query.patientId : undefined,
        doctorId: typeof req.query.doctorId === 'string' ? req.query.doctorId : undefined,
        search: typeof req.query.search === 'string' ? req.query.search : undefined,
      },
      req.user!
    );

    res.status(200).json({
      success: true,
      data: result.prescriptions,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getPrescriptionByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await PrescriptionService.getPrescriptionById(
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

export const reviewPrescriptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await PrescriptionService.reviewPrescription(
      id,
      req.user!,
      req.ip
    );

    res.status(200).json({
      success: true,
      message: 'Prescription reviewed successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const confirmPrescriptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await PrescriptionService.confirmPrescription(
      id,
      req.user!,
      req.ip
    );

    res.status(200).json({
      success: true,
      message: 'Prescription confirmed successfully',
      data: {
        id: data.id,
        status: data.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updatePrescriptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const validated = updatePrescriptionSchema.parse(req.body);
    const data = await PrescriptionService.updatePrescription(
      id,
      validated,
      req.user!,
      req.ip
    );

    res.status(200).json({
      success: true,
      message: 'Prescription updated successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const addPrescriptionItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const validated = prescriptionItemInputSchema.parse(req.body);
    const data = await PrescriptionService.addPrescriptionItem(
      id,
      validated,
      req.user!,
      req.ip
    );

    res.status(201).json({
      success: true,
      message: 'Prescription item added successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePrescriptionItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const itemId = Array.isArray(req.params.itemId) ? req.params.itemId[0] : req.params.itemId;
    const result = await PrescriptionService.deletePrescriptionItem(
      id,
      itemId,
      req.user!,
      req.ip
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const cancelPrescriptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await PrescriptionService.cancelPrescription(
      id,
      req.user!,
      req.ip
    );

    res.status(200).json({
      success: true,
      message: 'Prescription cancelled successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

import { Request, Response, NextFunction } from 'express';
import { PharmacyService } from '../services/pharmacy.service';
import {
  createPharmacySchema,
  updatePharmacySchema,
  verifyPharmacySchema,
  pharmacyStatusSchema,
} from '../utils/validators';

export const createPharmacyController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validated = createPharmacySchema.parse(req.body);
    const data = await PharmacyService.createPharmacy(
      validated,
      req.user!,
      req.ip
    );

    res.status(201).json({
      success: true,
      message: 'Pharmacy registered successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getPharmaciesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await PharmacyService.getPharmacies({
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      search: typeof req.query.search === 'string' ? req.query.search : undefined,
      isVerified: typeof req.query.isVerified === 'string' ? req.query.isVerified : undefined,
      isActive: typeof req.query.isActive === 'string' ? req.query.isActive : undefined,
      tieUpStatus: typeof req.query.tieUpStatus === 'string' ? req.query.tieUpStatus : undefined,
    });

    res.status(200).json({
      success: true,
      data: result.pharmacies,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getAvailablePharmaciesController = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await PharmacyService.getAvailablePharmacies();
    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getPharmacyByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await PharmacyService.getPharmacyById(id);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePharmacyController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const validated = updatePharmacySchema.parse(req.body);
    const data = await PharmacyService.updatePharmacy(
      id,
      validated,
      req.user!,
      req.ip
    );

    res.status(200).json({
      success: true,
      message: 'Pharmacy updated successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPharmacyController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { isVerified } = verifyPharmacySchema.parse(req.body);
    const data = await PharmacyService.verifyPharmacy(
      id,
      isVerified,
      req.user!,
      req.ip
    );

    res.status(200).json({
      success: true,
      message: `Pharmacy verification status updated to ${isVerified}`,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePharmacyStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const validated = pharmacyStatusSchema.parse(req.body);
    const data = await PharmacyService.updatePharmacyStatus(
      id,
      validated,
      req.user!,
      req.ip
    );

    res.status(200).json({
      success: true,
      message: 'Pharmacy status updated successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

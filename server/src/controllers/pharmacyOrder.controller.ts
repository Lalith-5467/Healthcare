import { Request, Response, NextFunction } from 'express';
import { PharmacyOrderService } from '../services/pharmacyOrder.service';
import {
  createPharmacyOrderSchema,
  declinePharmacyOrderSchema,
  updatePharmacyOrderStatusSchema,
} from '../utils/validators';

export const createPharmacyOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validated = createPharmacyOrderSchema.parse(req.body);
    const data = await PharmacyOrderService.createPharmacyOrder(
      validated,
      req.user!,
      req.ip
    );

    res.status(201).json({
      success: true,
      message: 'Pharmacy order created and routed successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getPharmacyOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await PharmacyOrderService.getPharmacyOrders(
      {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        status: typeof req.query.status === 'string' ? req.query.status : undefined,
        pharmacyId: typeof req.query.pharmacyId === 'string' ? req.query.pharmacyId : undefined,
        patientId: typeof req.query.patientId === 'string' ? req.query.patientId : undefined,
      },
      req.user!
    );

    res.status(200).json({
      success: true,
      data: result.orders,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getPharmacyOrderByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await PharmacyOrderService.getPharmacyOrderById(
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

export const acceptPharmacyOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await PharmacyOrderService.acceptPharmacyOrder(
      id,
      req.user!,
      req.ip
    );

    res.status(200).json({
      success: true,
      message: 'Pharmacy order accepted successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const declinePharmacyOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { reason } = declinePharmacyOrderSchema.parse(req.body);
    const data = await PharmacyOrderService.declinePharmacyOrder(
      id,
      reason,
      req.user!,
      req.ip
    );

    res.status(200).json({
      success: true,
      message: 'Pharmacy order declined successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePharmacyOrderStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status } = updatePharmacyOrderStatusSchema.parse(req.body);
    const data = await PharmacyOrderService.updatePharmacyOrderStatus(
      id,
      status,
      req.user!,
      req.ip
    );

    res.status(200).json({
      success: true,
      message: `Pharmacy order status updated successfully to ${data.status}`,
      data,
    });
  } catch (error) {
    next(error);
  }
};

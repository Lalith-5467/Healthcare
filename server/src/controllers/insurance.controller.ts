import { Request, Response, NextFunction } from 'express';
import { InsuranceService } from '../services/insurance.service';

export const getPoliciesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const search = req.query.search as string;
    const data = await InsuranceService.getPolicies(req.user!.id, req.user!.role, search);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getPolicyByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await InsuranceService.getPolicyById(id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createPolicyController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await InsuranceService.createPolicy(req.user!.id, req.user!.role, req.body);
    res.status(201).json({ success: true, message: 'Insurance policy registered successfully', data });
  } catch (error) {
    next(error);
  }
};

export const getClaimsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const status = req.query.status as string;
    const data = await InsuranceService.getClaims(req.user!.id, req.user!.role, status);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createClaimController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await InsuranceService.createClaim(req.user!.id, req.user!.role, req.body);
    res.status(201).json({ success: true, message: 'Claim filed successfully', data });
  } catch (error) {
    next(error);
  }
};

export const updateClaimStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status, approvedAmount, reason } = req.body;
    const data = await InsuranceService.updateClaimStatus(id, status, approvedAmount, reason);
    res.status(200).json({ success: true, message: 'Claim status updated successfully', data });
  } catch (error) {
    next(error);
  }
};

export const getPreAuthorizationsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await InsuranceService.getPreAuthorizations(req.user!.id, req.user!.role);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getSettlementsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await InsuranceService.getSettlements(req.user!.id, req.user!.role);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

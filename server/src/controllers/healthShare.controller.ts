import { Request, Response, NextFunction } from 'express';
import { HealthShareService } from '../services/healthShare.service';

export const generateQRTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const durationMinutes = req.body.durationMinutes ? Number(req.body.durationMinutes) : 30;
    const data = await HealthShareService.generateQRToken(req.user!.id, durationMinutes);

    res.status(200).json({
      success: true,
      message: 'Secure QR token generated successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const validateQRTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.body;
    if (!token || typeof token !== 'string') {
      res.status(400).json({ success: false, message: 'Valid QR token is required' });
      return;
    }

    const data = await HealthShareService.validateQRToken(req.user!.id, token, req.ip);

    res.status(200).json({
      success: true,
      message: 'QR token validated and patient identified successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createAccessRequestController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token, purpose, permissionScope, notes, durationMinutes } = req.body;
    if (!token) {
      res.status(400).json({ success: false, message: 'QR token reference is required' });
      return;
    }

    const data = await HealthShareService.createAccessRequest(
      req.user!.id,
      {
        token,
        purpose,
        permissionScope,
        notes,
        durationMinutes: durationMinutes ? Number(durationMinutes) : 60,
      },
      req.ip
    );

    res.status(201).json({
      success: true,
      message: 'Access request created and sent to patient successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getPatientAccessRequestsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await HealthShareService.getPatientAccessRequests(req.user!.id);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getDoctorAccessRequestsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await HealthShareService.getDoctorAccessRequests(req.user!.id);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const approveAccessRequestController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const requestId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { permissionScope, durationMinutes } = req.body;

    const data = await HealthShareService.approveAccessRequest(
      req.user!.id,
      requestId,
      permissionScope,
      durationMinutes ? Number(durationMinutes) : 60,
      req.ip
    );

    res.status(200).json({
      success: true,
      message: 'Access request approved and temporary session activated',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectAccessRequestController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const requestId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await HealthShareService.rejectAccessRequest(req.user!.id, requestId, req.ip);

    res.status(200).json({
      success: true,
      message: 'Access request rejected successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const revokeAccessController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const requestId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await HealthShareService.revokeAccess(req.user!.id, requestId, req.ip);

    res.status(200).json({
      success: true,
      message: 'Health record access session revoked successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getPatient360DataController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const patientId = Array.isArray(req.params.patientId) ? req.params.patientId[0] : req.params.patientId;
    const data = await HealthShareService.getPatient360Data(req.user!.id, patientId, req.ip);

    res.status(200).json({
      success: true,
      message: 'Authorized patient 360 data retrieved successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

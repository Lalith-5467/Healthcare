import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { ProfileService } from '../services/profile.service';
import {
  patientUpdateSchema,
  doctorUpdateSchema,
  nurseUpdateSchema,
  pharmacistUpdateSchema,
  caregiverUpdateSchema,
  insuranceUpdateSchema,
} from '../utils/validators';

function getTargetUserId(req: Request): string {
  const user = req.user!;
  // Admins & Super Admins can query or edit on behalf of another user if ?userId is provided
  if (
    (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) &&
    typeof req.query.userId === 'string'
  ) {
    return req.query.userId;
  }
  return user.id;
}

export const getCurrentUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await ProfileService.getCurrentUserProfile(req.user!.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// PATIENT HANDLERS
// ==========================================
export const getPatientProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const targetUserId = getTargetUserId(req);
    const data = await ProfileService.getPatientProfile(targetUserId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updatePatientProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const targetUserId = getTargetUserId(req);
    const validated = patientUpdateSchema.parse(req.body);
    const data = await ProfileService.updatePatientProfile(
      targetUserId,
      validated,
      req.user!.id,
      req.ip
    );
    res.status(200).json({ success: true, message: 'Patient profile updated successfully', data });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// DOCTOR HANDLERS
// ==========================================
export const getDoctorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const targetUserId = getTargetUserId(req);
    const data = await ProfileService.getDoctorProfile(targetUserId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateDoctorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const targetUserId = getTargetUserId(req);
    const validated = doctorUpdateSchema.parse(req.body);
    const data = await ProfileService.updateDoctorProfile(
      targetUserId,
      validated,
      req.user!.id,
      req.ip
    );
    res.status(200).json({ success: true, message: 'Doctor profile updated successfully', data });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// NURSE HANDLERS
// ==========================================
export const getNurseProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const targetUserId = getTargetUserId(req);
    const data = await ProfileService.getNurseProfile(targetUserId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateNurseProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const targetUserId = getTargetUserId(req);
    const validated = nurseUpdateSchema.parse(req.body);
    const data = await ProfileService.updateNurseProfile(
      targetUserId,
      validated,
      req.user!.id,
      req.ip
    );
    res.status(200).json({ success: true, message: 'Nurse profile updated successfully', data });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// PHARMACIST HANDLERS
// ==========================================
export const getPharmacistProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const targetUserId = getTargetUserId(req);
    const data = await ProfileService.getPharmacistProfile(targetUserId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updatePharmacistProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const targetUserId = getTargetUserId(req);
    const validated = pharmacistUpdateSchema.parse(req.body);
    const data = await ProfileService.updatePharmacistProfile(
      targetUserId,
      validated,
      req.user!.id,
      req.ip
    );
    res.status(200).json({ success: true, message: 'Pharmacist profile updated successfully', data });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// CAREGIVER HANDLERS
// ==========================================
export const getCaregiverProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const targetUserId = getTargetUserId(req);
    const data = await ProfileService.getCaregiverProfile(targetUserId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateCaregiverProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const targetUserId = getTargetUserId(req);
    const validated = caregiverUpdateSchema.parse(req.body);
    const data = await ProfileService.updateCaregiverProfile(
      targetUserId,
      validated,
      req.user!.id,
      req.ip
    );
    res.status(200).json({ success: true, message: 'Caregiver profile updated successfully', data });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// INSURANCE HANDLERS
// ==========================================
export const getInsuranceProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const targetUserId = getTargetUserId(req);
    const data = await ProfileService.getInsuranceProfile(targetUserId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateInsuranceProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const targetUserId = getTargetUserId(req);
    const validated = insuranceUpdateSchema.parse(req.body);
    const data = await ProfileService.updateInsuranceProfile(
      targetUserId,
      validated,
      req.user!.id,
      req.ip
    );
    res.status(200).json({ success: true, message: 'Insurance profile updated successfully', data });
  } catch (error) {
    next(error);
  }
};

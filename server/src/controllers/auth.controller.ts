import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await AuthService.login(req.body);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const userProfile = await AuthService.getCurrentUser(req.user.id);
    res.status(200).json({
      success: true,
      data: userProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const sendOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, name, role } = req.body;
    const result = await AuthService.sendEmailOtp(email, name, role);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const verifyOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otp } = req.body;
    const result = await AuthService.verifyEmailOtp(email, otp);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const hospitalLoginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await AuthService.loginHospital(req.body);
    res.status(200).json({
      success: true,
      message: 'Hospital administrator login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const hospitalRegisterController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await AuthService.registerHospital(req.body);
    res.status(201).json({
      success: true,
      message: 'Facility registered successfully and submitted for Super Admin review.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const hospitalStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const identifier = req.query.email || req.query.id || req.params.identifier;
    if (!identifier || typeof identifier !== 'string') {
      res.status(400).json({ success: false, message: 'Identifier or email is required' });
      return;
    }
    const result = await AuthService.getHospitalStatus(identifier);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


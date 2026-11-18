import { Router } from 'express';
import { Role } from '@prisma/client';
import {
  registerController,
  loginController,
  getMeController,
  sendOtpController,
  verifyOtpController,
  hospitalLoginController,
  hospitalRegisterController,
  hospitalStatusController,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// Public routes
router.post('/register', registerController);
router.post('/login', loginController);
router.post('/send-otp', sendOtpController);
router.post('/verify-otp', verifyOtpController);

// Hospital Management Authentication & Registration
router.post('/hospital/login', hospitalLoginController);
router.post('/hospital/register', hospitalRegisterController);
router.get('/hospital/status', hospitalStatusController);
router.get('/hospital/status/:identifier', hospitalStatusController);

// Protected routes (Requires valid JWT)
router.get('/me', authenticate, getMeController);

// Role-protected test routes for verifying requireRole middleware
router.get('/test/doctor-only', authenticate, requireRole(Role.DOCTOR), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Doctor-only portal',
    user: req.user,
  });
});

router.get('/test/patient-only', authenticate, requireRole(Role.PATIENT), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Patient portal',
    user: req.user,
  });
});

export default router;

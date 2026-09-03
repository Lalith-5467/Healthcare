import { Router } from 'express';
import { Role } from '@prisma/client';
import {
  registerController,
  loginController,
  getMeController,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// Public routes
router.post('/register', registerController);
router.post('/login', loginController);

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

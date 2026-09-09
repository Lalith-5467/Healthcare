import { Router } from 'express';
import { Role } from '@prisma/client';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import {
  getUsersController,
  getUserByIdController,
  updateUserStatusController,
  updateUserRoleController,
} from '../controllers/admin.controller';

const router = Router();

// All admin routes require authentication
router.use(authenticate);

// 1. List users with pagination and filters (ADMIN & SUPER_ADMIN)
router.get(
  '/users',
  requireRole(Role.ADMIN, Role.SUPER_ADMIN),
  getUsersController
);

// 2. Get single user details with role profile (ADMIN & SUPER_ADMIN)
router.get(
  '/users/:id',
  requireRole(Role.ADMIN, Role.SUPER_ADMIN),
  getUserByIdController
);

// 3. Activate or deactivate user (ADMIN & SUPER_ADMIN)
router.patch(
  '/users/:id/status',
  requireRole(Role.ADMIN, Role.SUPER_ADMIN),
  updateUserStatusController
);

// 4. Update user role (SUPER_ADMIN ONLY - Ordinary ADMIN receives 403 Forbidden)
router.patch(
  '/users/:id/role',
  requireRole(Role.SUPER_ADMIN),
  updateUserRoleController
);

export default router;

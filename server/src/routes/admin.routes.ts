import { Router } from 'express';
import { Role } from '@prisma/client';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import {
  getUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
  deleteUserController,
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

// 2. Create new user with profile in MySQL (ADMIN & SUPER_ADMIN)
router.post(
  '/users',
  requireRole(Role.ADMIN, Role.SUPER_ADMIN),
  createUserController
);

// 3. Get single user details with role profile (ADMIN & SUPER_ADMIN)
router.get(
  '/users/:id',
  requireRole(Role.ADMIN, Role.SUPER_ADMIN),
  getUserByIdController
);

// 4. Update user details & profile in MySQL (ADMIN & SUPER_ADMIN)
router.put(
  '/users/:id',
  requireRole(Role.ADMIN, Role.SUPER_ADMIN),
  updateUserController
);

// 5. Delete user from MySQL (ADMIN & SUPER_ADMIN)
router.delete(
  '/users/:id',
  requireRole(Role.ADMIN, Role.SUPER_ADMIN),
  deleteUserController
);

// 6. Activate or deactivate user (ADMIN & SUPER_ADMIN)
router.patch(
  '/users/:id/status',
  requireRole(Role.ADMIN, Role.SUPER_ADMIN),
  updateUserStatusController
);

// 7. Update user role (SUPER_ADMIN ONLY - Ordinary ADMIN receives 403 Forbidden)
router.patch(
  '/users/:id/role',
  requireRole(Role.SUPER_ADMIN),
  updateUserRoleController
);

export default router;

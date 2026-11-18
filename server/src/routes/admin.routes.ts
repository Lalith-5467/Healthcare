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
  resetUserPasswordController,
  getAuditLogsController,
  getHospitalsController,
  createHospitalController,
  updateHospitalController,
  deleteHospitalController,
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

// 8. Shared System Settings & Configuration (ADMIN & SUPER_ADMIN)
import {
  getAdminSettings,
  updateSettings,
  publishDraftSettings,
  resetSettingsToDefault,
  getRbacMatrix,
  updateRbacMatrix,
  createRoleAnnouncement,
  updateRoleAnnouncement,
  deleteRoleAnnouncement,
  toggleRoleAnnouncement,
  updateRoleWidgets,
  resetRoleWidgets,
} from '../controllers/settings.controller';

router.get('/settings', requireRole(Role.ADMIN, Role.SUPER_ADMIN), getAdminSettings);
router.put('/settings', requireRole(Role.ADMIN, Role.SUPER_ADMIN), updateSettings);
router.post('/settings/publish', requireRole(Role.SUPER_ADMIN), publishDraftSettings);
router.post('/settings/reset', requireRole(Role.SUPER_ADMIN), resetSettingsToDefault);
router.get('/roles-permissions/matrix', requireRole(Role.ADMIN, Role.SUPER_ADMIN), getRbacMatrix);
router.put('/roles-permissions/matrix', requireRole(Role.SUPER_ADMIN), updateRbacMatrix);
router.post('/settings/dashboards/:role/announcements', requireRole(Role.ADMIN, Role.SUPER_ADMIN), createRoleAnnouncement);
router.put('/settings/dashboards/:role/announcements/:id', requireRole(Role.ADMIN, Role.SUPER_ADMIN), updateRoleAnnouncement);
router.delete('/settings/dashboards/:role/announcements/:id', requireRole(Role.ADMIN, Role.SUPER_ADMIN), deleteRoleAnnouncement);
router.patch('/settings/dashboards/:role/announcements/:id/toggle', requireRole(Role.ADMIN, Role.SUPER_ADMIN), toggleRoleAnnouncement);
router.put('/settings/dashboards/:role/widgets', requireRole(Role.ADMIN, Role.SUPER_ADMIN), updateRoleWidgets);
router.post('/settings/dashboards/:role/widgets/reset', requireRole(Role.ADMIN, Role.SUPER_ADMIN), resetRoleWidgets);

// 9. Reset User Password (ADMIN & SUPER_ADMIN)
router.post('/users/:id/reset-password', requireRole(Role.ADMIN, Role.SUPER_ADMIN), resetUserPasswordController);

// 10. Audit Logs Stream (ADMIN & SUPER_ADMIN)
router.get('/audit-logs', requireRole(Role.ADMIN, Role.SUPER_ADMIN), getAuditLogsController);

// 11. Hospital Management APIs (ADMIN & SUPER_ADMIN)
router.get('/hospitals', requireRole(Role.ADMIN, Role.SUPER_ADMIN), getHospitalsController);
router.post('/hospitals', requireRole(Role.ADMIN, Role.SUPER_ADMIN), createHospitalController);
router.put('/hospitals/:id', requireRole(Role.ADMIN, Role.SUPER_ADMIN), updateHospitalController);
router.delete('/hospitals/:id', requireRole(Role.ADMIN, Role.SUPER_ADMIN), deleteHospitalController);

export default router;

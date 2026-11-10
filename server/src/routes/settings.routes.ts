import { Router } from 'express';
import { Role } from '@prisma/client';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import {
  getSettings,
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

const router = Router();

// Public: Get published global settings and branding
router.get('/', getSettings);

// Protected: Get full administrative settings with draft and audit
router.get('/admin', authenticate, requireRole(Role.ADMIN, Role.SUPER_ADMIN), getAdminSettings);

// Protected: Update system settings (Admin & Super Admin)
router.put('/', authenticate, requireRole(Role.ADMIN, Role.SUPER_ADMIN), updateSettings);

// Protected: Publish draft settings to live frontend (Super Admin only)
router.post('/publish', authenticate, requireRole(Role.SUPER_ADMIN), publishDraftSettings);

// Protected: Reset system settings to default (Super Admin only)
router.post('/reset', authenticate, requireRole(Role.SUPER_ADMIN), resetSettingsToDefault);

// Protected: Get RBAC permission matrix from MySQL (Admin & Super Admin)
router.get('/rbac-matrix', authenticate, requireRole(Role.ADMIN, Role.SUPER_ADMIN), getRbacMatrix);

// Protected: Update RBAC permission matrix in MySQL (Super Admin only)
router.put('/rbac-matrix', authenticate, requireRole(Role.SUPER_ADMIN), updateRbacMatrix);

// Protected: Role Dashboard Announcements & Widgets CRUD (Admin & Super Admin)
router.post('/dashboards/:role/announcements', authenticate, requireRole(Role.ADMIN, Role.SUPER_ADMIN), createRoleAnnouncement);
router.put('/dashboards/:role/announcements/:id', authenticate, requireRole(Role.ADMIN, Role.SUPER_ADMIN), updateRoleAnnouncement);
router.delete('/dashboards/:role/announcements/:id', authenticate, requireRole(Role.ADMIN, Role.SUPER_ADMIN), deleteRoleAnnouncement);
router.patch('/dashboards/:role/announcements/:id/toggle', authenticate, requireRole(Role.ADMIN, Role.SUPER_ADMIN), toggleRoleAnnouncement);
router.put('/dashboards/:role/widgets', authenticate, requireRole(Role.ADMIN, Role.SUPER_ADMIN), updateRoleWidgets);
router.post('/dashboards/:role/widgets/reset', authenticate, requireRole(Role.ADMIN, Role.SUPER_ADMIN), resetRoleWidgets);

export default router;

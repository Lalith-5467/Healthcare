import { Router } from 'express';
import { Role } from '@prisma/client';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import {
  getHealthVideos,
  addHealthVideo,
  updateHealthVideo,
  deleteHealthVideo,
  approveHealthVideo,
  disableHealthVideo,
  restoreHealthVideo,
  undoHealthVideoChange,
  getHealthVideoHistory,
  getHealthTopics,
  addHealthTopic,
  updateHealthTopic,
  deleteHealthTopic
} from '../controllers/adminHealthVideo.controller';

const router = Router();

// Secure all admin health video routes with SUPER_ADMIN
router.use(authenticate);
router.use(requireRole(Role.SUPER_ADMIN));

// Health Video APIs
router.get('/videos', getHealthVideos);
router.post('/videos', addHealthVideo);
router.put('/videos/:id', updateHealthVideo);
router.delete('/videos/:id', deleteHealthVideo);

// Video Status Actions
router.post('/videos/:id/approve', approveHealthVideo);
router.post('/videos/:id/disable', disableHealthVideo);
router.post('/videos/:id/restore', restoreHealthVideo);
router.post('/videos/:id/undo', undoHealthVideoChange);

// History API
router.get('/videos/history', getHealthVideoHistory);

// Health Topic APIs
router.get('/topics', getHealthTopics);
router.post('/topics', addHealthTopic);
router.put('/topics/:id', updateHealthTopic);
router.delete('/topics/:id', deleteHealthTopic);

export default router;

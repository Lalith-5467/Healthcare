import { Router } from 'express';
import { getPatientHealthTopics, assignPatientHealthTopic, removePatientHealthTopic } from '../controllers/patientHealthTopic.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true });

// All routes require authentication
router.use(authenticate);

// GET /api/patients/:patientId/health-topics
router.get('/', getPatientHealthTopics);

// POST /api/patients/:patientId/health-topics
router.post('/', assignPatientHealthTopic);

// DELETE /api/patients/:patientId/health-topics/:topicId
router.delete('/:topicId', removePatientHealthTopic);

export default router;

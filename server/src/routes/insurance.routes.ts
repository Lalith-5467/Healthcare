import { Router } from 'express';
import {
  getPoliciesController,
  getPolicyByIdController,
  createPolicyController,
  getClaimsController,
  createClaimController,
  updateClaimStatusController,
  getPreAuthorizationsController,
  getSettlementsController,
} from '../controllers/insurance.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All insurance routes require authentication
router.use(authenticate);

router.get('/policies', getPoliciesController);
router.get('/policies/:id', getPolicyByIdController);
router.post('/policies', createPolicyController);

router.get('/claims', getClaimsController);
router.post('/claims', createClaimController);
router.patch('/claims/:id/status', updateClaimStatusController);

router.get('/preauth', getPreAuthorizationsController);
router.get('/settlements', getSettlementsController);

export default router;

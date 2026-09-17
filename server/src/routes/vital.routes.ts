import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getVitalsController, createVitalController } from '../controllers/vital.controller';

const router = Router();

router.use(authenticate);

router.get('/', getVitalsController);
router.post('/', createVitalController);

export default router;

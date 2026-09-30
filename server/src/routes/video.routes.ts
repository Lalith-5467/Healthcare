import { Router } from 'express';
import { getHealthVideos } from '../controllers/video.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getHealthVideos);

export default router;

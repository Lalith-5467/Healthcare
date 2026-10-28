import { Router } from 'express';
import { 
  searchHealthShortsController, 
  getHealthShortsFeedController 
} from '../controllers/healthShorts.controller';

const router = Router();

// Dynamic Search endpoint: /api/health-shorts/search?q=fitness
router.get('/search', searchHealthShortsController);

// Dynamic Feed endpoint: /api/health-shorts/feed?category=Wellness
router.get('/feed', getHealthShortsFeedController);

// Default GET endpoint: /api/health-shorts?q=fitness&category=Fitness
router.get('/', searchHealthShortsController);

export default router;

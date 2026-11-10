import { Router } from 'express';
import { 
  searchHealthShortsController, 
  getHealthShortsFeedController,
  getHealthShortsSuggestionsController
} from '../controllers/healthShorts.controller';

const router = Router();

// Real-time YouTube-style search autocomplete suggestions: /api/health-shorts/suggest?q=hand
router.get('/suggest', getHealthShortsSuggestionsController);

// Dynamic Search endpoint: /api/health-shorts/search?q=fitness
router.get('/search', searchHealthShortsController);

// Dynamic Feed endpoint: /api/health-shorts/feed?category=Wellness
router.get('/feed', getHealthShortsFeedController);

// Default GET endpoint: /api/health-shorts?q=fitness&category=Fitness
router.get('/', searchHealthShortsController);

export default router;

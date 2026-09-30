import { Router } from 'express';
import { searchFood, getFoodDetails } from '../controllers/nutrition.controller';

const router = Router();

router.get('/search', searchFood);
router.post('/details', getFoodDetails);

export default router;

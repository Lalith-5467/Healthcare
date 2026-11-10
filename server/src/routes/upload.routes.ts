import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { uploadFileHandler } from '../controllers/upload.controller';

const router = Router();

// Secure file upload endpoint (authenticated users)
router.post('/', authenticate, uploadFileHandler);

export default router;

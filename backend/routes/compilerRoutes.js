import { Router } from 'express';
import { runCode } from '../controllers/compilerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/run', protect, runCode);

export default router;
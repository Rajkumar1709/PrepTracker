import { Router } from 'express';
import { getDailyChallenge } from '../controllers/dailyChallengeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, getDailyChallenge);

export default router;  
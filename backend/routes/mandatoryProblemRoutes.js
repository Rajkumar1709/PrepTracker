import { Router } from 'express';
import { getMandatoryProblems } from '../controllers/mandatoryProblemController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, getMandatoryProblems);

export default router;
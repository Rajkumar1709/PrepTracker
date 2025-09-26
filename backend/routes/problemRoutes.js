import { Router } from 'express';
import { getProblems, createProblem } from '../controllers/problemController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Apply the 'protect' middleware to both routes
router.route('/')
    .get(protect, getProblems)
    .post(protect, createProblem);

export default router;
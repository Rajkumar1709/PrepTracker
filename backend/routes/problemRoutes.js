import { Router } from 'express';
// Make sure to import updateProblem
import { getProblems, createProblem, updateProblem, deleteProblem } from '../controllers/problemController.js'; 
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/')
    .get(protect, getProblems)
    .post(protect, createProblem);

// Add this new route for updating
router.route('/:id')
    .put(protect, updateProblem)
    .delete(protect, deleteProblem);

export default router;
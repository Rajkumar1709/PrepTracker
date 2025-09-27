import { Router } from 'express';
import { searchJobs } from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Protect this route so only logged-in users can search for jobs
router.get('/', protect, searchJobs);

export default router;
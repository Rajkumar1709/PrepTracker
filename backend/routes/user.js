import { Router } from 'express';
import { registerUser, loginUser, getMe } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js'; // 1. Import the middleware

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe); // 2. Add this protected route

export default router;
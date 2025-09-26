// routes/user.js

import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

// Route to create a new user
router.post('/register', async (req, res) => {
  try {
    const { username } = req.body;
    const newUser = new User({ username });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user', details: err.message });
  }
});

export default router;
// routes/progress.js

import { Router } from 'express';
import UserProgress from '../models/UserProgress.js';

const router = Router();

// Route to get a user's progress for all problems
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await UserProgress.find({ userId }).populate('problemId');
    res.status(200).json(progress);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve user progress', details: err.message });
  }
});

// Route to update the status of a specific problem for a user
router.post('/update', async (req, res) => {
  try {
    const { userId, problemId, status, notes } = req.body;

    const updatedProgress = await UserProgress.findOneAndUpdate(
      { userId, problemId },
      { status, notes, lastUpdated: new Date() },
      { new: true, upsert: true } // upsert: creates new doc if not found
    );

    res.status(200).json(updatedProgress);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update progress', details: err.message });
  }
});

export default router;
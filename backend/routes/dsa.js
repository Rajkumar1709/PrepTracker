// routes/dsa.js

import { Router } from 'express';
import Problem from '../models/Problem.js';

const router = Router();

// Route to add all DSA problems (this is already there)
router.post('/add-problems', async (req, res) => {
  try {
    const problems = req.body;
    await Problem.insertMany(problems);
    res.status(201).json({ message: 'Problems added successfully!', count: problems.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add problems', details: err.message });
  }
});

// Route to get all DSA problems with filtering
router.get('/', async (req, res) => {
  try {
    const { category, level, status } = req.query;
    let filter = {};

    // Build the filter object based on the query parameters
    if (category) {
      filter.category = category;
    }
    if (level) {
      filter.level = level;
    }
    if (status) {
      filter.status = status;
    }

    const problems = await Problem.find(filter);
    res.status(200).json(problems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve problems', details: err.message });
  }
});

export default router;
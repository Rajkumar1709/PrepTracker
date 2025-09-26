import { Router } from 'express';
import MasterProblem from '../models/MasterProblem.js';

const router = Router();

router.get('/categories', async (req, res) => {
  // Log when the request is received
  console.log('--- Request received for /api/master-problems/categories ---'); 
  try {
    const categories = await MasterProblem.distinct('category');
    // Log what was found in the database
    console.log('Found categories:', categories); 
    res.status(200).json(categories.sort());
  } catch (err) {
    // Log if an error occurred
    console.error('ERROR FETCHING CATEGORIES:', err); 
    res.status(500).json({ message: 'Failed to retrieve categories', error: err.message });
  }
});

// (The rest of your routes in this file remain the same)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};

    if (category) {
      filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    const problems = await MasterProblem.find(filter);
    res.status(200).json(problems);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve problems', error: err.message });
  }
});

export default router;
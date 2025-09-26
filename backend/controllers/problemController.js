import Problem from '../models/Problem.js';

// @desc    Get all problems for a user
// @route   GET /api/problems
// @access  Private
export const getProblems = async (req, res) => {
    // We get req.user from the 'protect' middleware
    const problems = await Problem.find({ user: req.user.id });
    res.status(200).json(problems);
};

// @desc    Create a new problem
// @route   POST /api/problems
// @access  Private
export const createProblem = async (req, res) => {
    const { title, platform, link, difficulty, status } = req.body;

    if (!title || !platform || !link || !difficulty) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    const problem = await Problem.create({
        user: req.user.id,
        title,
        platform,
        link,
        difficulty,
        status,
    });

    res.status(201).json(problem);
};

// You can add update and delete functions here later!
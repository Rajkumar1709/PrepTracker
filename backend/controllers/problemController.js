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
    // This is the new line for debugging
    console.log('--- Received request body ---:', req.body);

    const { title, platform, link, category, difficulty, status } = req.body;

    if (!title || !platform || !link || !category || !difficulty) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    const problem = await Problem.create({
        user: req.user.id,
        title,
        platform,
        link,
        category,
        difficulty,
        status,
    });

    res.status(201).json(problem);
};


// @desc    Update a tracked problem
// @route   PUT /api/problems/:id
// @access  Private
export const updateProblem = async (req, res) => {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
        return res.status(404).json({ message: 'Problem not found' });
    }

    // Make sure the logged-in user owns the problem
    if (problem.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedProblem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedProblem);
};

// @desc    Delete a tracked problem
// @route   DELETE /api/problems/:id
// @access  Private
export const deleteProblem = async (req, res) => {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
        return res.status(404).json({ message: 'Problem not found' });
    }

    // Make sure the logged-in user owns the problem
    if (problem.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    await problem.deleteOne(); // Use deleteOne() or remove()
    res.status(200).json({ id: req.params.id, message: 'Problem removed' });
};
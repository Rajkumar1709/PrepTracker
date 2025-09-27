import Problem from '../models/Problem.js'; // User's tracked problems

// @desc    Get detailed user analytics data
// @route   GET /api/analytics
// @access  Private
export const getAnalytics = async (req, res) => {
    try {
        const userProblems = await Problem.find({ user: req.user.id });

        // 1. Calculate Status Counts
        const statusCounts = { Solved: 0, Attempted: 0, 'Not Attempted': 0 };
        userProblems.forEach(p => {
            if (p.status) statusCounts[p.status]++;
        });

        // 2. Calculate Difficulty Breakdown (Tracked vs. Solved)
        const difficultyData = {
            Easy: { tracked: 0, solved: 0 },
            Medium: { tracked: 0, solved: 0 },
            Hard: { tracked: 0, solved: 0 },
        };
        userProblems.forEach(p => {
            if (difficultyData[p.difficulty]) {
                difficultyData[p.difficulty].tracked++;
                if (p.status === 'Solved') {
                    difficultyData[p.difficulty].solved++;
                }
            }
        });
        
        // 3. Calculate Category Breakdown (Tracked vs. Solved)
        const categoryData = {};
        userProblems.forEach(p => {
            if (!p.category) return; // Skip if no category
            if (!categoryData[p.category]) {
                categoryData[p.category] = { tracked: 0, solved: 0 };
            }
            categoryData[p.category].tracked++;
            if (p.status === 'Solved') {
                categoryData[p.category].solved++;
            }
        });

        // Structure the final response
        const analytics = {
            totalTracked: userProblems.length,
            totalSolved: statusCounts.Solved,
            statusCounts: [
                { name: 'Solved', value: statusCounts.Solved },
                { name: 'Attempted', value: statusCounts.Attempted },
                { name: 'Not Attempted', value: statusCounts['Not Attempted'] },
            ],
            difficultyData: [
                { name: 'Easy', ...difficultyData.Easy },
                { name: 'Medium', ...difficultyData.Medium },
                { name: 'Hard', ...difficultyData.Hard },
            ],
            categoryData: Object.entries(categoryData).map(([key, value]) => ({ name: key, ...value })),
        };

        res.status(200).json(analytics);

    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
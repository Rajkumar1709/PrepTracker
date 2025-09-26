import Problem from '../models/Problem.js'; // User's tracked problems
import MasterProblem from '../models/MasterProblem.js'; // The master list

// @desc    Get user analytics data
// @route   GET /api/analytics
// @access  Private
export const getAnalytics = async (req, res) => {
    try {
        // Fetch user's tracked problems and the entire master problem list concurrently
        const [userProblems, masterProblems] = await Promise.all([
            Problem.find({ user: req.user.id }),
            MasterProblem.find({})
        ]);

        // --- Calculate Totals ---
        const totalProblemsByDifficulty = { Easy: 0, Medium: 0, Hard: 0 };
        for (const problem of masterProblems) {
            totalProblemsByDifficulty[problem.level]++;
        }

        // --- Calculate User's Solved Stats ---
        const solvedProblemsByDifficulty = { Easy: 0, Medium: 0, Hard: 0 };
        const solvedProblemsByCategory = {};

        for (const problem of userProblems) {
            // We only count 'Solved' problems for these stats
            if (problem.status === 'Solved') {
                solvedProblemsByDifficulty[problem.difficulty]++;
                
                // The master problem for this tracked problem needs to be found to get the category
                const masterDoc = masterProblems.find(p => p.name === problem.title);
                if (masterDoc) {
                    const category = masterDoc.category;
                    if (!solvedProblemsByCategory[category]) {
                        solvedProblemsByCategory[category] = 0;
                    }
                    solvedProblemsByCategory[category]++;
                }
            }
        }
        
        // Structure the final response
        const analytics = {
            solvedStats: {
                total: userProblems.filter(p => p.status === 'Solved').length,
                easy: solvedProblemsByDifficulty.Easy,
                medium: solvedProblemsByDifficulty.Medium,
                hard: solvedProblemsByDifficulty.Hard,
            },
            totalStats: {
                total: masterProblems.length,
                easy: totalProblemsByDifficulty.Easy,
                medium: totalProblemsByDifficulty.Medium,
                hard: totalProblemsByDifficulty.Hard,
            },
            categoryStats: solvedProblemsByCategory
        };

        res.status(200).json(analytics);

    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
import Problem from '../models/Problem.js';
import MasterProblem from '../models/MasterProblem.js';

export const getAnalytics = async (req, res) => {
    try {
        const [userProblems, masterProblems] = await Promise.all([
            Problem.find({ user: req.user.id }),
            MasterProblem.find({})
        ]);

        const statusCountObject = { Solved: 0, Attempted: 0, 'Not Attempted': 0 };
        const difficultyData = {
            Easy: { tracked: 0, solved: 0 },
            Medium: { tracked: 0, solved: 0 },
            Hard: { tracked: 0, solved: 0 },
        };
        const categoryData = {};

        userProblems.forEach(p => {
            if (p.status) statusCountObject[p.status]++;
            if (difficultyData[p.difficulty]) {
                difficultyData[p.difficulty].tracked++;
                if (p.status === 'Solved') {
                    difficultyData[p.difficulty].solved++;
                }
            }
            if (p.category) {
                 if (!categoryData[p.category]) {
                    categoryData[p.category] = { tracked: 0, solved: 0 };
                }
                categoryData[p.category].tracked++;
                if (p.status === 'Solved') {
                    categoryData[p.category].solved++;
                }
            }
        });

        const analytics = {
            totalTracked: userProblems.length,
            totalSolved: statusCountObject.Solved,
            // THIS IS THE FIX: Convert the status count object into an array
            statusCounts: [
                { name: 'Solved', value: statusCountObject.Solved },
                { name: 'Attempted', value: statusCountObject.Attempted },
                { name: 'Not Attempted', value: statusCountObject['Not Attempted'] },
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
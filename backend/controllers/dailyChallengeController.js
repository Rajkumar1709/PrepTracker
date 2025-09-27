import MandatoryProblem from '../models/MandatoryProblem.js';
import MasterProblem from '../models/MasterProblem.js';

export const getDailyChallenge = async (req, res) => {
    try {
        // Get the total count of problems from both collections
        const [mandatoryCount, masterCount] = await Promise.all([
            MandatoryProblem.countDocuments(),
            MasterProblem.countDocuments()
        ]);
        const totalCount = mandatoryCount + masterCount;

        if (totalCount === 0) {
            return res.status(404).json({ message: 'No problems available to select a challenge.' });
        }

        // Use the current date as a "seed" to get a consistent random index for the whole day
        const date = new Date();
        const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const seed = date.getFullYear() * 1000 + dayOfYear;
        const randomIndex = seed % totalCount;
        
        let challengeProblem;

        // Find the problem at the calculated index
        if (randomIndex < mandatoryCount) {
            challengeProblem = await MandatoryProblem.findOne().skip(randomIndex);
        } else {
            challengeProblem = await MasterProblem.findOne().skip(randomIndex - mandatoryCount);
        }

        res.status(200).json(challengeProblem);
    } catch (error) {
        console.error('Error fetching daily challenge:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
import MandatoryProblem from '../models/MandatoryProblem.js';

export const getMandatoryProblems = async (req, res) => {
    try {
        const problems = await MandatoryProblem.find({});
        res.status(200).json(problems);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
import mongoose from 'mongoose';

// This model now uses the main mongoose connection
const mandatoryProblemSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  level: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  link: { type: String, required: true },
  mandatory: { type: Boolean, default: true }
}, {
  // Tell Mongoose to use the 'mandatory-problems' collection
  collection: 'mandatory-problems' 
});

const MandatoryProblem = mongoose.model('MandatoryProblem', mandatoryProblemSchema);

export default MandatoryProblem;
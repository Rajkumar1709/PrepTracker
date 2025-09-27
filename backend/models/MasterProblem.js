import mongoose from 'mongoose';

const masterProblemSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  level: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  link: { type: String, required: true },
  mandatory: { type: Boolean, default: false }
}, {
  // Tell Mongoose to use your 'problems' collection for the browser
  collection: 'problems' 
});

const MasterProblem = mongoose.model('MasterProblem', masterProblemSchema);

export default MasterProblem;
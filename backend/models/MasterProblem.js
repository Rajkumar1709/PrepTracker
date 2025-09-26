import mongoose from 'mongoose';

const masterProblemSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  level: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  link: { type: String, required: true },
}, {
  // Tell Mongoose to use your existing collection name
  collection: 'problems' 
});

const MasterProblem = mongoose.model('MasterProblem', masterProblemSchema);

export default MasterProblem;
import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  // A reference to the user who is tracking this problem
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // Details of the problem being tracked
  title: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  // This field stores the user's progress on the problem
  status: {
    type: String,
    enum: ['Not Attempted', 'Attempted', 'Solved'],
    default: 'Not Attempted',
  },
}, {
  // Automatically adds 'createdAt' and 'updatedAt' fields
  timestamps: true,
  // Saves these documents to a dedicated 'userproblems' collection
  collection: 'userproblems'
});

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;
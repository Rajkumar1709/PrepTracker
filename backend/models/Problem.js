import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  category: {
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
  status: {
    type: String,
    enum: ['Not Attempted', 'Attempted', 'Solved'],
    default: 'Not Attempted',
  },
}, {
  timestamps: true,
  collection: 'userproblems'
});

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;
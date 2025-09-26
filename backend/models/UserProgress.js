// models/UserProgress.js

import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
  // A reference to the user who is tracking this problem.
  // We will assume a 'User' model exists later.
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' 
  },
  // A reference to the specific problem being tracked.
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Problem'
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Completed'],
    default: 'To Do',
  },
  notes: {
    type: String,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

export default UserProgress;
// models/Problem.js

import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  level: {
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
    enum: ['To Do', 'In Progress', 'Completed'],
    default: 'To Do',
  },
});

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;
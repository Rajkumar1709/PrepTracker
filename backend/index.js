import dotenv from 'dotenv';
dotenv.config(); // MUST be the first line

import express from 'express';
import connectDB from './config/db.js';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/user.js';
import problemRoutes from './routes/problemRoutes.js';
import masterProblemRoutes from './routes/masterProblemRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import mandatoryProblemRoutes from './routes/mandatoryProblemRoutes.js';
import dailyChallengeRoutes from './routes/dailyChallengeRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
connectDB();
app.use(cors());
app.use(express.json());

// API Routes - This is the corrected setup
app.use('/api/users', userRoutes);
app.use('/api/problems', problemRoutes); 
app.use('/api/master-problems', masterProblemRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/mandatory-problems', mandatoryProblemRoutes);
app.use('/api/daily-challenge', dailyChallengeRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully! ✨'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic route to check if the server is running
app.get('/', (req, res) => {
  res.send('PrepTracker API is running...');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
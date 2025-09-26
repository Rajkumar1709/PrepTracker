// server.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import dsaRoutes from './routes/dsa.js';
import progressRoutes from './routes/progress.js';
import userRoutes from './routes/user.js';
// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/dsa', dsaRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/users', userRoutes);
// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully! ✨'))
  .catch(err => console.error('MongoDB connection error:', err));

// API routes
app.use('/api/dsa', dsaRoutes);

// Basic route to check if the server is running
app.get('/', (req, res) => {
  res.send('PrepTracker API is running...');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
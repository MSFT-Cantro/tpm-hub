import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import teamsRoutes from './routes/teams-routes.js';
import slackRoutes from './routes/slack-routes.js';

dotenv.config();

const app = express();
const PORT = 3001; // Explicitly set to 3001 to avoid conflicts

// Middleware
app.use(cors());
app.use(express.json());

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Release Notes API' });
});

// Routes
app.use('/teams-message', teamsRoutes);
app.use('/slack-message', slackRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import campaignRoutes from './routes/campaignRoutes';
import messageRoutes from './routes/messageRoutes';

dotenv.config();

// Connect to MongoDB (try to connect, but continue if it fails)
(async () => {
  try {
    await connectDB();
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.log('MongoDB connection failed, continuing without database');
    console.error(error);
  }
})()

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/campaigns', campaignRoutes);
app.use('/personalized-message', messageRoutes);

// Home route
app.get('/', (_req: Request, res: Response) => {
  res.send('Campaign Management API is running');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

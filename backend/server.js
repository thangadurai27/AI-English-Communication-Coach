import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import testRoutes from './routes/testRoutes.js';

// Load environment variables FIRST
dotenv.config();

// Connect to MongoDB AFTER env vars are loaded
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://ai-english-communication-coach.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/conversation', conversationRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/challenge', challengeRoutes);
app.use('/api/test', testRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('AI Communication Coach API is running...');
});

const PORT = process.env.PORT || 5000;

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (error) => {
  console.error('❌ Server Error:', error);
  process.exit(1);
});

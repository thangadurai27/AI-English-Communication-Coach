import express from 'express';
import { getDailyChallenge, completeChallenge, getLeaderboard } from '../controllers/challengeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/daily', protect, getDailyChallenge);
router.post('/complete', protect, completeChallenge);
router.get('/leaderboard', protect, getLeaderboard);

export default router;

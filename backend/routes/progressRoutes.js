import express from 'express';
import { getDashboard, getWeeklyStats, getSkillBreakdown, updateProgress } from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, getDashboard);
router.get('/weekly', protect, getWeeklyStats);
router.get('/skills', protect, getSkillBreakdown);
router.post('/update', protect, updateProgress);

export default router;

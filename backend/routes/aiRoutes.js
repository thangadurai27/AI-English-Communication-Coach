import express from 'express';
import { analyzeText } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze', protect, analyzeText);

export default router;

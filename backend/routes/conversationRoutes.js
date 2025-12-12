import express from 'express';
import { startConversation, sendMessage, endConversation } from '../controllers/conversationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/start', protect, startConversation);
router.post('/message', protect, sendMessage);
router.post('/end', protect, endConversation);

export default router;

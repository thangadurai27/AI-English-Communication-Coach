import express from 'express';
import { generateLesson, getRapidFireQuestion, getWordBuilderWord, evaluateWordBuilder } from '../controllers/lessonController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, generateLesson);
router.get('/rapidfire', protect, getRapidFireQuestion);
router.get('/wordbuilder/word', protect, getWordBuilderWord);
router.post('/wordbuilder/evaluate', protect, evaluateWordBuilder);

export default router;

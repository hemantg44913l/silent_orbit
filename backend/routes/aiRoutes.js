import { Router } from 'express';
import { generateAIResponse } from '../services/aiService.js';

const router = Router();

/**
 * POST /api/ai/chat
 * Free AI Chatbot endpoint for doubts & queries
 */
router.post('/chat', async (req, res, next) => {
  try {
    const { message, history } = req.body || {};
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Message field is required.' }
      });
    }

    const aiResult = await generateAIResponse(message, history);

    return res.status(200).json({
      success: true,
      data: {
        reply: aiResult.reply,
        source: aiResult.source,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;

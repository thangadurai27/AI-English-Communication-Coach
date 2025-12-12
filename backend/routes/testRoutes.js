import express from 'express';
import Groq from 'groq-sdk';

const router = express.Router();

// Test endpoint to verify GROQ API
router.get('/test-groq', async (req, res) => {
  try {
    console.log('🧪 Testing GROQ API...');
    console.log('API Key exists:', !!process.env.GROQ_API_KEY);
    console.log('API Key length:', process.env.GROQ_API_KEY?.length);
    
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'user', content: 'Say "Hello, GROQ is working!" in one sentence.' }
      ],
      temperature: 0.7,
      max_tokens: 50,
    });

    const response = completion.choices[0]?.message?.content;
    console.log('✅ GROQ Response:', response);
    
    res.json({ 
      success: true, 
      message: 'GROQ API is working!',
      response: response 
    });
  } catch (error) {
    console.error('❌ GROQ Test Error:', error.message);
    console.error('Error details:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
});

export default router;

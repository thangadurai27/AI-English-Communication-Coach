import Groq from 'groq-sdk';
import Session from '../models/Session.js';

const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

const conversations = {}; // Store conversation history per user

// @desc    Start conversation mode
// @route   POST /api/conversation/start
// @access  Private
export const startConversation = async (req, res) => {
  try {
    const { scenario } = req.body;
    console.log('💬 Starting conversation with scenario:', scenario);
    
    const userId = req.user._id.toString();
    conversations[userId] = {
      scenario,
      messages: []
    };

    let systemPrompt = '';
    switch (scenario) {
      case 'Job Interview':
        systemPrompt = 'You are a hiring manager conducting a job interview. Ask relevant questions and respond professionally.';
        break;
      case 'Restaurant':
        systemPrompt = 'You are a waiter at a restaurant. Help the customer order food and respond naturally.';
        break;
      case 'Travel':
        systemPrompt = 'You are a travel guide. Help the tourist with directions and information.';
        break;
      case 'Customer Support':
        systemPrompt = 'You are a customer support representative. Help resolve customer issues.';
        break;
      case 'Meeting':
        systemPrompt = 'You are a business colleague in a meeting. Discuss ideas and collaborate.';
        break;
      default:
        systemPrompt = 'You are a friendly conversation partner practicing English.';
    }

    conversations[userId].systemPrompt = systemPrompt;

    // Get AI's first message
    const completion = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt + ' Start the conversation with a greeting or opening statement.' },
        { role: 'user', content: `Start a ${scenario} conversation.` }
      ],
      temperature: 0.8,
      max_tokens: 200,
    });

    const aiMessage = completion.choices[0]?.message?.content;
    conversations[userId].messages.push({ role: 'assistant', content: aiMessage });

    res.json({ 
      scenario,
      message: aiMessage,
      conversationId: userId
    });
  } catch (error) {
    console.error('Error starting conversation:', error.message);
    res.status(500).json({ 
      message: 'Error starting conversation', 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
};

// @desc    Send message in conversation
// @route   POST /api/conversation/message
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id.toString();
    console.log('💬 User message:', message.substring(0, 50) + '...');

    if (!conversations[userId]) {
      return res.status(400).json({ message: 'No active conversation. Start one first.' });
    }

    // Add user message
    conversations[userId].messages.push({ role: 'user', content: message });

    // Get AI response with conversation context
    const completion = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: conversations[userId].systemPrompt },
        ...conversations[userId].messages
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    conversations[userId].messages.push({ role: 'assistant', content: aiResponse });

    // Score the user's message
    const scoreCompletion = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Score this English response (0-100) based on grammar, vocabulary, and naturalness. Return only JSON: {"score": number, "feedback": "brief comment"}'
        },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    let scoreData;
    try {
      const scoreText = scoreCompletion.choices[0]?.message?.content;
      scoreData = JSON.parse(scoreText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
    } catch {
      scoreData = { score: 75, feedback: 'Good response!' };
    }

    res.json({
      aiMessage: aiResponse,
      score: scoreData.score,
      feedback: scoreData.feedback
    });
  } catch (error) {
    console.error('Error in conversation:', error.message);
    res.status(500).json({ 
      message: 'Error in conversation', 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
};

// @desc    End conversation and save
// @route   POST /api/conversation/end
// @access  Private
export const endConversation = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    if (!conversations[userId]) {
      return res.status(400).json({ message: 'No active conversation' });
    }

    // Save conversation as a session
    const transcript = conversations[userId].messages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n\n');

    await Session.create({
      user: req.user._id,
      type: 'conversation',
      transcript,
      scenario: conversations[userId].scenario,
      analysis: { motivation: 'Great conversation practice!' },
      xpEarned: 15,
    });

    delete conversations[userId];

    res.json({ message: 'Conversation saved successfully', xpEarned: 15 });
  } catch (error) {
    console.error('Error ending conversation:', error.message);
    res.status(500).json({ 
      message: 'Error ending conversation', 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
};

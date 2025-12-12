import Challenge from '../models/Challenge.js';
import Session from '../models/Session.js';
import User from '../models/User.js';
import Groq from 'groq-sdk';

const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

// @desc    Get daily challenge
// @route   GET /api/challenge/daily
// @access  Private
export const getDailyChallenge = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let challenge = await Challenge.findOne({
      createdAt: { $gte: today }
    });

    if (!challenge) {
      // Generate new challenge
      const completion = await getGroq().chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Generate a daily English challenge. Return JSON: {"sentence": "a sentence to pronounce", "vocabularyWord": {"word": "word", "definition": "def", "example": "sentence"}, "conversation": {"scenario": "name", "prompt": "starting prompt"}, "motivationalQuote": "quote"}'
          },
          { role: 'user', content: 'Create today\'s challenge' }
        ],
        temperature: 0.9,
        max_tokens: 400,
      });

      let challengeData;
      try {
        const text = completion.choices[0]?.message?.content;
        challengeData = JSON.parse(text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
      } catch {
        challengeData = {
          sentence: "The quick brown fox jumps over the lazy dog.",
          vocabularyWord: {
            word: "resilient",
            definition: "able to recover quickly from difficulties",
            example: "She is a resilient person who never gives up."
          },
          conversation: {
            scenario: "Casual Chat",
            prompt: "Talk about your favorite hobby."
          },
          motivationalQuote: "Practice makes perfect!"
        };
      }

      challenge = await Challenge.create(challengeData);
    }

    // Check if user completed it
    const completed = challenge.completedBy.includes(req.user._id);

    res.json({
      challenge,
      completed,
      completionCount: challenge.completedBy.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching challenge', error: error.message });
  }
};

// @desc    Complete daily challenge
// @route   POST /api/challenge/complete
// @access  Private
export const completeChallenge = async (req, res) => {
  try {
    const { challengeId, response } = req.body;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    if (challenge.completedBy.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already completed today\'s challenge' });
    }

    // Add to completed
    challenge.completedBy.push(req.user._id);
    await challenge.save();

    // Award XP
    const user = await User.findById(req.user._id);
    user.totalXP += 5;

    if (user.totalXP >= 1000) {
      user.level = 'Expert';
    } else if (user.totalXP >= 500) {
      user.level = 'Advanced';
    } else if (user.totalXP >= 200) {
      user.level = 'Intermediate';
    }

    await user.save();

    // Save as session
    await Session.create({
      user: req.user._id,
      type: 'challenge',
      transcript: response,
      analysis: { motivation: 'Daily challenge completed!' },
      xpEarned: 5,
    });

    res.json({
      message: 'Challenge completed!',
      xpEarned: 5,
      totalXP: user.totalXP,
      level: user.level,
      completionCount: challenge.completedBy.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error completing challenge', error: error.message });
  }
};

// @desc    Get challenge leaderboard
// @route   GET /api/challenge/leaderboard
// @access  Private
export const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find()
      .select('name totalXP level avatar')
      .sort({ totalXP: -1 })
      .limit(10);

    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
  }
};

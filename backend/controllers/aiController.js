import Groq from 'groq-sdk';
import Session from '../models/Session.js';
import Progress from '../models/Progress.js';
import Mistake from '../models/Mistake.js';
import User from '../models/User.js';

const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

// @desc    Analyze user's spoken text with advanced features
// @route   POST /api/ai/analyze
// @access  Private
export const analyzeText = async (req, res) => {
  try {
    const { text, type = 'practice', topic = '', scenario = '' } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Please provide text to analyze' });
    }

    // Call GROQ API with enhanced prompt
    const completion = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an advanced English Communication Coach. Analyze the user's spoken text and return JSON strictly in this format:
{
  "grammar": "Brief grammar feedback",
  "vocabulary": "Brief vocabulary suggestions",
  "pronunciation": 85,
  "fluency": 80,
  "pace": 75,
  "clarity": 90,
  "fillerWords": 15,
  "emotionTone": "confident/nervous/excited/monotone",
  "mistake_explanation": "Explanation of mistakes if any",
  "improved_version": "Improved version of the text",
  "motivation": "Motivational message",
  "pronunciation_details": {
    "difficult_sounds": ["th", "r"],
    "stress_pattern": "incorrect on second syllable",
    "phonetic_output": "/ˈθɪs ɪz ən ɪgˈzæmpəl/"
  }
}
Make sure all score fields are numbers between 0-100. Always return valid JSON only, no additional text.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const responseText = completion.choices[0]?.message?.content;
    
    let analysis;
    try {
      const cleanedResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      analysis = {
        grammar: "Analysis completed",
        vocabulary: "Keep practicing",
        pronunciation: 75,
        fluency: 75,
        pace: 70,
        clarity: 80,
        fillerWords: 10,
        emotionTone: "neutral",
        mistake_explanation: "Unable to parse detailed analysis",
        improved_version: text,
        motivation: "Great effort! Keep practicing.",
        pronunciation_details: {
          difficult_sounds: [],
          stress_pattern: "good",
          phonetic_output: ""
        }
      };
    }

    // Save session
    const session = await Session.create({
      user: req.user._id,
      type,
      transcript: text,
      analysis,
      topic,
      scenario,
      xpEarned: 10,
    });

    // Update or create progress
    let progress = await Progress.findOne({ user: req.user._id });
    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        totalSessions: 1,
        averagePronunciation: analysis.pronunciation,
        averageFluency: analysis.fluency,
        totalXP: 10,
      });
    } else {
      const newTotal = progress.totalSessions + 1;
      progress.totalSessions = newTotal;
      progress.averagePronunciation = 
        (progress.averagePronunciation * (newTotal - 1) + analysis.pronunciation) / newTotal;
      progress.averageFluency = 
        (progress.averageFluency * (newTotal - 1) + analysis.fluency) / newTotal;
      progress.totalXP += 10;
      
      // Update level based on XP
      if (progress.totalXP >= 1000) progress.level = 'Expert';
      else if (progress.totalXP >= 500) progress.level = 'Advanced';
      else if (progress.totalXP >= 200) progress.level = 'Intermediate';
      
      await progress.save();
    }

    // Update user XP and level
    await User.findByIdAndUpdate(req.user._id, {
      totalXP: progress.totalXP,
      level: progress.level,
    });

    // Log mistakes if any
    if (analysis.mistake_explanation && analysis.mistake_explanation !== "Unable to parse detailed analysis") {
      await Mistake.create({
        user: req.user._id,
        category: 'Grammar',
        originalText: text,
        correctedText: analysis.improved_version,
        explanation: analysis.mistake_explanation,
        session: session._id,
      });
    }

    res.json({
      ...analysis,
      xpEarned: 10,
      totalXP: progress.totalXP,
      level: progress.level,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error analyzing text', error: error.message });
  }
};

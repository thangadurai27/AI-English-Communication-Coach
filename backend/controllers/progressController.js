import Progress from '../models/Progress.js';
import Session from '../models/Session.js';
import Mistake from '../models/Mistake.js';
import User from '../models/User.js';

// @desc    Get user progress dashboard
// @route   GET /api/progress/dashboard
// @access  Private
export const getDashboard = async (req, res) => {
  try {
    let progress = await Progress.findOne({ user: req.user._id });

    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        totalSessions: 0,
        averagePronunciation: 0,
        averageFluency: 0,
        averageGrammar: 0,
        averageVocabulary: 0,
        totalXP: 0,
        level: 'Beginner',
      });
    }

    // Get recent sessions (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSessions = await Session.find({
      user: req.user._id,
      createdAt: { $gte: sevenDaysAgo }
    }).sort({ createdAt: -1 });

    // Calculate weekly stats
    const weeklyStats = {
      sessionsThisWeek: recentSessions.length,
      totalMinutes: recentSessions.reduce((sum, s) => sum + (s.duration || 0), 0),
      xpGained: recentSessions.reduce((sum, s) => sum + (s.xpEarned || 0), 0),
    };

    // Get top mistakes
    const topMistakes = await Mistake.find({ user: req.user._id })
      .sort({ frequency: -1 })
      .limit(5);

    // Calculate improvement trend
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    const sessionsLast30Days = await Session.find({
      user: req.user._id,
      createdAt: { $gte: last30Days }
    }).sort({ createdAt: 1 });

    const improvementTrend = sessionsLast30Days.map(session => ({
      date: session.createdAt,
      pronunciation: session.analysis?.pronunciation || 0,
      fluency: session.analysis?.fluency || 0,
      grammar: session.analysis?.grammar || 0,
    }));

    res.json({
      progress,
      weeklyStats,
      topMistakes,
      improvementTrend,
      recentSessions: recentSessions.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard', error: error.message });
  }
};

// @desc    Get weekly practice stats
// @route   GET /api/progress/weekly
// @access  Private
export const getWeeklyStats = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const sessions = await Session.find({
      user: req.user._id,
      createdAt: { $gte: sevenDaysAgo }
    }).sort({ createdAt: 1 });

    // Group by day
    const weeklyData = {};
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayName = days[date.getDay()];
      weeklyData[dayName] = { sessions: 0, xp: 0, minutes: 0 };
    }

    sessions.forEach(session => {
      const dayName = days[new Date(session.createdAt).getDay()];
      if (weeklyData[dayName]) {
        weeklyData[dayName].sessions++;
        weeklyData[dayName].xp += session.xpEarned || 0;
        weeklyData[dayName].minutes += session.duration || 0;
      }
    });

    res.json(weeklyData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching weekly stats', error: error.message });
  }
};

// @desc    Get skill breakdown
// @route   GET /api/progress/skills
// @access  Private
export const getSkillBreakdown = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id }).limit(20);

    if (sessions.length === 0) {
      return res.json({
        pronunciation: 0,
        fluency: 0,
        grammar: 0,
        vocabulary: 0,
      });
    }

    const totals = sessions.reduce((acc, session) => {
      acc.pronunciation += session.analysis?.pronunciation || 0;
      acc.fluency += session.analysis?.fluency || 0;
      acc.grammar += session.analysis?.grammar || 0;
      acc.vocabulary += session.analysis?.vocabulary || 0;
      return acc;
    }, { pronunciation: 0, fluency: 0, grammar: 0, vocabulary: 0 });

    const count = sessions.length;

    res.json({
      pronunciation: Math.round(totals.pronunciation / count),
      fluency: Math.round(totals.fluency / count),
      grammar: Math.round(totals.grammar / count),
      vocabulary: Math.round(totals.vocabulary / count),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skills', error: error.message });
  }
};

// @desc    Update progress after session
// @route   POST /api/progress/update
// @access  Private
export const updateProgress = async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    let progress = await Progress.findOne({ user: req.user._id });
    
    if (!progress) {
      progress = await Progress.create({ user: req.user._id });
    }

    // Update totals
    progress.totalSessions += 1;
    progress.totalXP += session.xpEarned || 0;

    // Recalculate averages
    const allSessions = await Session.find({ user: req.user._id });
    const count = allSessions.length;

    if (count > 0) {
      progress.averagePronunciation = Math.round(
        allSessions.reduce((sum, s) => sum + (s.analysis?.pronunciation || 0), 0) / count
      );
      progress.averageFluency = Math.round(
        allSessions.reduce((sum, s) => sum + (s.analysis?.fluency || 0), 0) / count
      );
      progress.averageGrammar = Math.round(
        allSessions.reduce((sum, s) => sum + (s.analysis?.grammar || 0), 0) / count
      );
      progress.averageVocabulary = Math.round(
        allSessions.reduce((sum, s) => sum + (s.analysis?.vocabulary || 0), 0) / count
      );
    }

    // Update level
    if (progress.totalXP >= 1000) {
      progress.level = 'Expert';
    } else if (progress.totalXP >= 500) {
      progress.level = 'Advanced';
    } else if (progress.totalXP >= 200) {
      progress.level = 'Intermediate';
    } else {
      progress.level = 'Beginner';
    }

    await progress.save();

    // Also update user
    await User.findByIdAndUpdate(req.user._id, {
      totalXP: progress.totalXP,
      level: progress.level,
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress', error: error.message });
  }
};

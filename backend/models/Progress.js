import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  totalSessions: {
    type: Number,
    default: 0,
  },
  averagePronunciation: {
    type: Number,
    default: 0,
  },
  averageFluency: {
    type: Number,
    default: 0,
  },
  totalXP: {
    type: Number,
    default: 0,
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Beginner',
  },
  weeklyPractice: [{
    date: Date,
    sessions: Number,
    avgScore: Number,
  }],
  improvementPercentage: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;

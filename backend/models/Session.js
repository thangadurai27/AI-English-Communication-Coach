import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['practice', 'game', 'lesson', 'conversation', 'challenge'],
    required: true,
  },
  transcript: {
    type: String,
    required: true,
  },
  analysis: {
    grammar: String,
    vocabulary: String,
    pronunciation: Number,
    fluency: Number,
    pace: Number,
    clarity: Number,
    fillerWords: Number,
    emotionTone: String,
    mistake_explanation: String,
    improved_version: String,
    motivation: String,
    pronunciation_details: {
      difficult_sounds: [String],
      stress_pattern: String,
      phonetic_output: String,
    },
  },
  xpEarned: {
    type: Number,
    default: 10,
  },
  topic: String,
  scenario: String,
}, {
  timestamps: true,
});

const Session = mongoose.model('Session', sessionSchema);

export default Session;

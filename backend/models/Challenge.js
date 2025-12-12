import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  sentence: {
    type: String,
    required: true,
  },
  vocabularyWord: {
    type: String,
    required: true,
  },
  vocabularyDefinition: String,
  conversation: {
    prompt: String,
    expectedResponse: String,
  },
  motivationalQuote: String,
  completedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    score: Number,
    completedAt: Date,
  }],
}, {
  timestamps: true,
});

const Challenge = mongoose.model('Challenge', challengeSchema);

export default Challenge;

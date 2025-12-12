import mongoose from 'mongoose';

const mistakeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    enum: ['Grammar', 'Vocabulary', 'Pronunciation', 'Fluency'],
    required: true,
  },
  originalText: {
    type: String,
    required: true,
  },
  correctedText: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
  frequency: {
    type: Number,
    default: 1,
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
  },
}, {
  timestamps: true,
});

const Mistake = mongoose.model('Mistake', mistakeSchema);

export default Mistake;

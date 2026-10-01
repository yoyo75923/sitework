const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: Number },
  correctAnswer: { type: Number },
  explanation: String,
  points: { type: Number, default: 5 },
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'sustainability',
  },
  contentType: {
    type: String,
    default: 'infographic',
  },
  content: String,
  image: String,
  pointsToRead: [String],
  extraInfo: [String],
  questions: [questionSchema],
  totalPoints: {
    type: Number,
    default: 0,
  },
  availableDate: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Quiz', quizSchema);

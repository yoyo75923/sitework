const Quiz = require('../models/Quiz');
const User = require('../models/User');

// @desc    Get all quizzes
// @route   GET /api/quizzes
const getQuizzes = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const quizzes = await Quiz.find(query);
    res.json(quizzes);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
const getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz answers
// @route   POST /api/quizzes/:id/submit
const submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body; // array of selected answer indices
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Calculate score
    let score = 0;
    const results = quiz.questions.map((question, index) => {
      const isCorrect = answers[index] === question.answer;
      if (isCorrect) {
        score += question.points || 5;
      }
      return {
        questionId: question._id,
        selectedAnswer: answers[index],
        correctAnswer: question.answer,
        isCorrect,
        points: isCorrect ? (question.points || 5) : 0,
      };
    });

    // Update user
    const user = await User.findById(req.user._id);

    // Check if already completed
    const alreadyCompleted = user.completedQuizzes.some(
      q => q.quizId === req.params.id
    );

    if (!alreadyCompleted) {
      user.completedQuizzes.push({
        quizId: req.params.id,
        score,
        totalPoints: quiz.totalPoints,
        completedAt: new Date(),
      });
      user.greenPoints += score;
      user.quizStreak += 1;
      await user.save();
    }

    res.json({
      score,
      totalPoints: quiz.totalPoints,
      results,
      greenPointsEarned: alreadyCompleted ? 0 : score,
      alreadyCompleted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's quiz progress
// @route   GET /api/quizzes/progress
const getQuizProgress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      completedQuizzes: user.completedQuizzes,
      totalGreenPointsFromQuizzes: user.completedQuizzes.reduce((sum, q) => sum + q.score, 0),
      quizStreak: user.quizStreak,
      totalCompleted: user.completedQuizzes.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getQuizzes, getQuiz, submitQuiz, getQuizProgress };

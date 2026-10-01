const express = require('express');
const router = express.Router();
const { getQuizzes, getQuiz, submitQuiz, getQuizProgress } = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

// Public
router.get('/', getQuizzes);

// Protected
router.get('/progress', protect, getQuizProgress);
router.get('/:id', getQuiz);
router.post('/:id/submit', protect, submitQuiz);

module.exports = router;

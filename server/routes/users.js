const express = require('express');
const router = express.Router();
const { getProfile, getGreenPoints, getLeaderboard, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// All user routes require auth
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/green-points', getGreenPoints);
router.get('/leaderboard', getLeaderboard);

module.exports = router;

const User = require('../models/User');

// @desc    Get user profile with stats
// @route   GET /api/users/profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      type: user.type,
      greenPoints: user.greenPoints,
      co2Prevented: user.co2Prevented,
      rank: user.rank,
      city: user.city,
      quizStreak: user.quizStreak,
      completedQuizzes: user.completedQuizzes.length,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get green points & history
// @route   GET /api/users/green-points
const getGreenPoints = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      totalPoints: user.greenPoints,
      co2Prevented: user.co2Prevented,
      rank: user.rank,
      quizPointsEarned: user.completedQuizzes.reduce((sum, q) => sum + q.score, 0),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
const getLeaderboard = async (req, res, next) => {
  try {
    const { scope = 'global' } = req.query;
    const currentUser = await User.findById(req.user._id);

    let query = { type: 'customer' };
    if (scope === 'city' && currentUser.city) {
      query.city = currentUser.city;
    }

    const topUsers = await User.find(query)
      .sort({ greenPoints: -1 })
      .limit(10)
      .select('name greenPoints city');

    // Find current user's rank
    const userRank = await User.countDocuments({
      ...query,
      greenPoints: { $gt: currentUser.greenPoints },
    }) + 1;

    res.json({
      leaderboard: topUsers.map((u, i) => ({
        rank: i + 1,
        name: u.name,
        points: u.greenPoints,
        city: u.city,
        isCurrentUser: u._id.toString() === req.user._id.toString(),
      })),
      currentUserRank: userRank,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, city } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (city) user.city = city;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      type: user.type,
      greenPoints: user.greenPoints,
      city: user.city,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, getGreenPoints, getLeaderboard, updateProfile };

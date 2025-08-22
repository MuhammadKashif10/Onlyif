const User = require('../models/User');
const Property = require('../models/Property');
const { successResponse, errorResponse, paginationMeta } = require('../utils/responseFormatter');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalProperties, pendingProperties, activeAgents] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Property.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'agent', isActive: true })
    ]);

    const stats = {
      totalUsers,
      totalProperties,
      pendingProperties,
      activeAgents
    };

    res.json(
      successResponse(stats, 'Dashboard stats retrieved successfully')
    );
  } catch (error) {
    res.status(500).json(
      errorResponse('Server error retrieving dashboard stats', 500)
    );
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const role = req.query.role;

    let query = {};
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json(
      successResponse(
        users,
        'Users retrieved successfully',
        200,
        paginationMeta(page, limit, total)
      )
    );
  } catch (error) {
    res.status(500).json(
      errorResponse('Server error retrieving users', 500)
    );
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers
};